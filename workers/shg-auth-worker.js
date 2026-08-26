var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

var CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS }
  });
}
__name(json, "json");

function uuid() {
  return crypto.randomUUID();
}
__name(uuid, "uuid");

async function hashPassword(password, saltHex) {
  const enc = new TextEncoder();
  const salt = saltHex
    ? new Uint8Array(saltHex.match(/.{2}/g).map((b) => parseInt(b, 16)))
    : crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );
  const derivedBits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 1e5, hash: "SHA-256" },
    keyMaterial,
    256
  );
  const hashHex = [...new Uint8Array(derivedBits)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const saltHexOut = [...salt]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${saltHexOut}:${hashHex}`;
}
__name(hashPassword, "hashPassword");

async function verifyPassword(password, stored) {
  const [saltHex] = stored.split(":");
  const recomputed = await hashPassword(password, saltHex);
  const [, recomputedHash] = recomputed.split(":");
  const [, hashHex] = stored.split(":");
  return recomputedHash === hashHex;
}
__name(verifyPassword, "verifyPassword");

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
__name(isValidEmail, "isValidEmail");

var SESSION_DAYS = 30;

async function createSession(env, userId) {
  const token = uuid() + uuid();
  const expiresAt = new Date(
    Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1e3
  ).toISOString();
  await env.DB.prepare(
    `INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)`
  )
    .bind(token, userId, expiresAt)
    .run();
  return token;
}
__name(createSession, "createSession");

async function getUserFromToken(env, token) {
  if (!token) return null;
  const session = await env.DB.prepare(
    `SELECT s.user_id, s.expires_at FROM sessions s WHERE s.token = ?`
  )
    .bind(token)
    .first();
  if (!session) return null;
  if (new Date(session.expires_at) < new Date()) {
    await env.DB.prepare(`DELETE FROM sessions WHERE token = ?`)
      .bind(token)
      .run();
    return null;
  }
  const user = await env.DB.prepare(
    `SELECT id, email, full_name, tier, tier_expires_at, created_at FROM users WHERE id = ?`
  )
    .bind(session.user_id)
    .first();
  return user;
}
__name(getUserFromToken, "getUserFromToken");

// API routes this worker owns — everything else passes through to Cloudflare Pages.
const API_ROUTES = {
  "POST /signup":    handleSignup,
  "POST /login":     handleLogin,
  "POST /logout":    handleLogout,
  "GET /me":         handleMe,
  "POST /subscribe": handleSubscribe,
  "POST /leads":     handleLeads,
};

// Short redirect links — one per channel, never changes
const GO_LINKS = {
  "yt":    "/gift?utm_source=youtube&utm_medium=referral&utm_campaign=free_gift",
  "ig":    "/gift?utm_source=instagram&utm_medium=bio&utm_campaign=free_gift",
  "em":    "/gift?utm_source=email&utm_medium=email&utm_campaign=free_gift",
  "tk":    "/gift?utm_source=tiktok&utm_medium=bio&utm_campaign=free_gift",
  "wl-yt": "/?waitlist=1&utm_source=youtube&utm_medium=referral&utm_campaign=waitlist",
  "wl-ig": "/?waitlist=1&utm_source=instagram&utm_medium=bio&utm_campaign=waitlist",
  "wl-em": "/?waitlist=1&utm_source=email&utm_medium=email&utm_campaign=waitlist",
  "wl-tk": "/?waitlist=1&utm_source=tiktok&utm_medium=bio&utm_campaign=waitlist",
};

function isApiRoute(method, pathname) {
  return (`${method} ${pathname}`) in API_ROUTES;
}
__name(isApiRoute, "isApiRoute");

var worker_default = {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }
    const url = new URL(request.url);
    const { pathname } = url;

    // Known API route — handle it
    if (isApiRoute(request.method, pathname)) {
      try {
        return await API_ROUTES[`${request.method} ${pathname}`](request, env);
      } catch (err) {
        return json({ error: err.message || "Internal error" }, 500);
      }
    }

    // Short redirect links /go/*
    if (pathname.startsWith("/go/")) {
      const key = pathname.slice(4);
      const dest = GO_LINKS[key];
      if (dest) {
        try {
          await env.DB.prepare(
            "INSERT INTO go_clicks (id, link_key, referrer, user_agent, created_at) VALUES (?, ?, ?, ?, ?)"
          ).bind(crypto.randomUUID(), key, request.headers.get("referer")||null, request.headers.get("user-agent")||null, new Date().toISOString()).run();
        } catch(e) {}
        return Response.redirect("https://reshmaoracle.com" + dest, 302);
      }
    }

    // Everything else (static assets, SPA routes, homepage) — proxy to Pages
    const pagesUrl = new URL(request.url);
    pagesUrl.hostname = "shg-frontend.pages.dev";
    const pagesReq = new Request(pagesUrl.toString(), {
      method: request.method,
      headers: request.headers,
      body: ["GET","HEAD"].includes(request.method) ? undefined : request.body,
      redirect: "follow",
    });
    return fetch(pagesReq);
  },
};

async function handleSignup(request, env) {
  const { email, password, full_name } = await request.json();
  if (!email || !isValidEmail(email)) {
    return json({ error: "Valid email required" }, 400);
  }
  if (!password || password.length < 8) {
    return json({ error: "Password must be at least 8 characters" }, 400);
  }
  const existing = await env.DB.prepare(
    `SELECT id FROM users WHERE email = ?`
  )
    .bind(email.toLowerCase())
    .first();
  if (existing) {
    return json({ error: "An account with this email already exists" }, 409);
  }
  const id = uuid();
  const passwordHash = await hashPassword(password);
  await env.DB.prepare(
    `INSERT INTO users (id, email, password_hash, full_name, tier) VALUES (?, ?, ?, ?, 'free')`
  )
    .bind(id, email.toLowerCase(), passwordHash, full_name || null)
    .run();
  const token = await createSession(env, id);
  return json({
    success: true,
    token,
    user: { id, email: email.toLowerCase(), full_name: full_name || null, tier: "free" },
  });
}
__name(handleSignup, "handleSignup");

async function handleLogin(request, env) {
  const { email, password } = await request.json();
  if (!email || !password) {
    return json({ error: "Email and password required" }, 400);
  }
  const user = await env.DB.prepare(
    `SELECT id, email, password_hash, full_name, tier, tier_expires_at FROM users WHERE email = ?`
  )
    .bind(email.toLowerCase())
    .first();
  if (!user) {
    return json({ error: "Invalid email or password" }, 401);
  }
  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) {
    return json({ error: "Invalid email or password" }, 401);
  }
  const token = await createSession(env, user.id);
  return json({
    success: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      tier: user.tier,
      tier_expires_at: user.tier_expires_at,
    },
  });
}
__name(handleLogin, "handleLogin");

async function handleLogout(request, env) {
  const authHeader = request.headers.get("Authorization") || "";
  const token = authHeader.replace("Bearer ", "");
  if (token) {
    await env.DB.prepare(`DELETE FROM sessions WHERE token = ?`)
      .bind(token)
      .run();
  }
  return json({ success: true });
}
__name(handleLogout, "handleLogout");

async function handleMe(request, env) {
  const authHeader = request.headers.get("Authorization") || "";
  const token = authHeader.replace("Bearer ", "");
  const user = await getUserFromToken(env, token);
  if (!user) {
    return json({ error: "Not authenticated" }, 401);
  }
  return json({ user });
}
__name(handleMe, "handleMe");

async function handleSubscribe(request, env) {
  // Kept for backwards compat — same logic as handleLeads
  return handleLeads(request, env);
}
__name(handleSubscribe, "handleSubscribe");

async function handleLeads(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }
  const { first_name, name, email, source } = body;
  if (!email || !isValidEmail(email)) {
    return json({ error: "Valid email required" }, 400);
  }
  const id = uuid();
  const created_at = new Date().toISOString();
  const resolvedName = first_name || name || null;
  const utm_source = body.utm_source || null;
  const utm_medium = body.utm_medium || null;
  const utm_campaign = body.utm_campaign || null;

  await env.DB.prepare(
    `INSERT INTO gift_leads (id, first_name, email, source, utm_source, utm_medium, utm_campaign, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(id, resolvedName, email.toLowerCase(), source || null, utm_source, utm_medium, utm_campaign, created_at)
    .run();
  return json({ success: true, id });
}
__name(handleLeads, "handleLeads");

export { worker_default as default };
