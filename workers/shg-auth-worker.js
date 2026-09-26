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
  "POST /shop/checkout": handleShopCheckout,
  "GET /shop/download":  handleShopDownload,
  "GET /shop/purchases": handleShopPurchases,
  "GET /profile":    handleProfileGet,
  "POST /profile":   handleProfileSave,
  "POST /ask":       handleAsk,
};

// ── In-app shop (Stripe Checkout + private PDFs in R2 bucket shg-products) ──
const SHOP_PRODUCTS = {
  luckygirlmaxxing: { name: "Luckygirlmaxxing Workbook", amount: 2900, file: "SHG_LuckyGirlMaxxing_Workbook.pdf" },
  richgirlmaxxing:  { name: "Richgirlmaxxing Workbook",  amount: 2900, file: "SHG_RichGirlMaxxing_Workbook.pdf" },
};

async function stripeApi(env, path, form) {
  const res = await fetch("https://api.stripe.com/v1/" + path, {
    method: form ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      ...(form ? { "Content-Type": "application/x-www-form-urlencoded" } : {}),
    },
    body: form ? new URLSearchParams(form).toString() : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || "Stripe error");
  return data;
}
__name(stripeApi, "stripeApi");

async function handleShopCheckout(request, env) {
  if (!env.STRIPE_SECRET_KEY) return json({ error: "Shop is not switched on yet" }, 503);
  const { sku } = await request.json().catch(() => ({}));
  const p = SHOP_PRODUCTS[sku];
  if (!p) return json({ error: "Unknown product" }, 400);
  const user = await getUserFromToken(env, (request.headers.get("Authorization") || "").replace("Bearer ", ""));
  const origin = new URL(request.url).origin;
  const form = {
    mode: "payment",
    "line_items[0][quantity]": "1",
    "line_items[0][price_data][currency]": "usd",
    "line_items[0][price_data][unit_amount]": String(p.amount),
    "line_items[0][price_data][product_data][name]": p.name,
    "metadata[sku]": sku,
    success_url: `${origin}/portal?purchase={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/portal?shop=cancel`,
  };
  if (user?.email) form.customer_email = user.email;
  const session = await stripeApi(env, "checkout/sessions", form);
  return json({ url: session.url });
}
__name(handleShopCheckout, "handleShopCheckout");

// Verifies the Stripe session is paid, records it, then streams the PDF.
async function handleShopDownload(request, env) {
  const sid = new URL(request.url).searchParams.get("session_id") || "";
  if (!/^cs_[A-Za-z0-9_]+$/.test(sid)) return json({ error: "Missing purchase" }, 400);
  const session = await stripeApi(env, "checkout/sessions/" + sid);
  const sku = session.metadata?.sku;
  const p = SHOP_PRODUCTS[sku];
  if (session.payment_status !== "paid" || !p) return json({ error: "Payment not found" }, 402);
  try {
    await env.DB.prepare(
      "INSERT OR IGNORE INTO purchases (id, stripe_session_id, email, sku, amount, created_at) VALUES (?, ?, ?, ?, ?, ?)"
    ).bind(uuid(), sid, (session.customer_details?.email || "").toLowerCase(), sku, session.amount_total, new Date().toISOString()).run();
  } catch (e) {}
  const obj = await env.PRODUCTS.get(p.file);
  if (!obj) return json({ error: "File not uploaded yet" }, 404);
  return new Response(obj.body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${p.file}"`,
      ...CORS_HEADERS,
    },
  });
}
__name(handleShopDownload, "handleShopDownload");

async function handleShopPurchases(request, env) {
  const user = await getUserFromToken(env, (request.headers.get("Authorization") || "").replace("Bearer ", ""));
  if (!user) return json({ purchases: [] });
  const { results } = await env.DB.prepare(
    "SELECT stripe_session_id, sku, created_at FROM purchases WHERE email = ? ORDER BY created_at DESC"
  ).bind(user.email.toLowerCase()).all();
  return json({ purchases: results || [] });
}
__name(handleShopPurchases, "handleShopPurchases");

// Short redirect links — one per channel, never changes
const GO_LINKS = {
  "brain-yt-community": "https://shop.beacons.ai/reshmaoracle/e787f0e8-83b9-45a2-9cae-4fc70decae25?utm_source=youtube&utm_medium=community_post&utm_campaign=brain_guide",
  "brain-yt-desc":     "https://shop.beacons.ai/reshmaoracle/e787f0e8-83b9-45a2-9cae-4fc70decae25?utm_source=youtube&utm_medium=description&utm_campaign=brain_guide",
  "shop-yt-desc":      "https://beacons.ai/reshmaoracle?utm_source=youtube&utm_medium=description&utm_campaign=shop",
  // GIFT PAGE
  "gift-yt-bio":       "/gift?utm_source=youtube&utm_medium=bio&utm_campaign=free_gift",
  "gift-yt-desc":      "/gift?utm_source=youtube&utm_medium=description&utm_campaign=free_gift",
  "gift-yt-comment":   "/gift?utm_source=youtube&utm_medium=comment&utm_campaign=free_gift",
  "gift-yt-community": "/gift?utm_source=youtube&utm_medium=community_post&utm_campaign=free_gift",
  "gift-ig-bio":       "/gift?utm_source=instagram&utm_medium=bio&utm_campaign=free_gift",
  "gift-ig-story":     "/gift?utm_source=instagram&utm_medium=story&utm_campaign=free_gift",
  "gift-ig-reply":     "/gift?utm_source=instagram&utm_medium=smart_reply&utm_campaign=free_gift",
  "gift-email":        "/gift?utm_source=email&utm_medium=email&utm_campaign=free_gift",

  // WAITLIST
  "wl-yt-bio":         "/?waitlist=1&utm_source=youtube&utm_medium=bio&utm_campaign=waitlist",
  "wl-yt-desc":        "/?waitlist=1&utm_source=youtube&utm_medium=description&utm_campaign=waitlist",
  "wl-yt-comment":     "/?waitlist=1&utm_source=youtube&utm_medium=comment&utm_campaign=waitlist",
  "wl-yt-community":   "/?waitlist=1&utm_source=youtube&utm_medium=community_post&utm_campaign=waitlist",
  "wl-ig-bio":         "/?waitlist=1&utm_source=instagram&utm_medium=bio&utm_campaign=waitlist",
  "wl-ig-story":       "/?waitlist=1&utm_source=instagram&utm_medium=story&utm_campaign=waitlist",
  "wl-ig-reply":       "/?waitlist=1&utm_source=instagram&utm_medium=smart_reply&utm_campaign=waitlist",
  "wl-email":          "/?waitlist=1&utm_source=email&utm_medium=email&utm_campaign=waitlist",

  // LOVEMAXXING WORKBOOK
  "love-yt-desc":      "https://shop.beacons.ai/reshmaoracle/4386c71b-1ba1-4e6c-8b34-c6b8468615db&utm_source=youtube&utm_medium=description&utm_campaign=lovemaxxing",
  "love-yt-community": "https://shop.beacons.ai/reshmaoracle/4386c71b-1ba1-4e6c-8b34-c6b8468615db&utm_source=youtube&utm_medium=community_post&utm_campaign=lovemaxxing",
  "love-ig-bio":       "https://shop.beacons.ai/reshmaoracle/4386c71b-1ba1-4e6c-8b34-c6b8468615db&utm_source=instagram&utm_medium=bio&utm_campaign=lovemaxxing",
  "love-ig-reply":     "https://shop.beacons.ai/reshmaoracle/4386c71b-1ba1-4e6c-8b34-c6b8468615db&utm_source=instagram&utm_medium=smart_reply&utm_campaign=lovemaxxing",
  "love-email":        "https://shop.beacons.ai/reshmaoracle/4386c71b-1ba1-4e6c-8b34-c6b8468615db&utm_source=email&utm_medium=email&utm_campaign=lovemaxxing",

  // BLOG
  "blog-yt-desc":       "/blog?utm_source=youtube&utm_medium=description&utm_campaign=blog",
  "blog-email":         "/blog/timing-windows-lucky-girl?utm_source=email&utm_medium=email&utm_campaign=luckygirlmaxxing",

  // QUIZ
  "quiz-lucky-yt-desc": "/blocks/luckygirl?utm_source=youtube&utm_medium=description&utm_campaign=luckygirlmaxxing",

  // LUCKYGIRL WORKBOOK
  "lucky-yt-desc":      "https://shop.beacons.ai/reshmaoracle/765f9e37-68f6-4d14-bc86-c952a2ca565f?utm_source=youtube&utm_medium=description&utm_campaign=luckygirlmaxxing",
  "lucky-yt-community": "https://shop.beacons.ai/reshmaoracle/765f9e37-68f6-4d14-bc86-c952a2ca565f?utm_source=youtube&utm_medium=community_post&utm_campaign=luckygirlmaxxing",
  "lucky-ig-bio":       "https://shop.beacons.ai/reshmaoracle/765f9e37-68f6-4d14-bc86-c952a2ca565f?utm_source=instagram&utm_medium=bio&utm_campaign=luckygirlmaxxing",
  "lucky-ig-reply":     "https://shop.beacons.ai/reshmaoracle/765f9e37-68f6-4d14-bc86-c952a2ca565f?utm_source=instagram&utm_medium=smart_reply&utm_campaign=luckygirlmaxxing",
  "lucky-email":        "https://shop.beacons.ai/reshmaoracle/765f9e37-68f6-4d14-bc86-c952a2ca565f?utm_source=email&utm_medium=email&utm_campaign=luckygirlmaxxing",
};

function isApiRoute(method, pathname) {
  return (`${method} ${pathname}`) in API_ROUTES;
}
__name(isApiRoute, "isApiRoute");


async function notifyReshma(env, subject, body) {
  try {
    await fetch("https://api.nitrosend.com/v1/transactional/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${env.NITROSEND_API_KEY}`
      },
      body: JSON.stringify({
        to: "reshma@reshmaoracle.com",
        from: "noreply@reshmaoracle.com",
        subject: subject,
        html: `<div style="font-family:sans-serif;padding:20px;background:#000;color:#fdf0e8;">${body}</div>`
      })
    });
  } catch(e) {}
}

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
        const redirectUrl = dest.startsWith("http") ? dest : "https://reshmaoracle.com" + dest;
        return Response.redirect(redirectUrl, 302);
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
    `SELECT id, email, password_hash, full_name, tier, tier_expires_at, created_at FROM users WHERE email = ?`
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
      created_at: user.created_at,
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
  await notifyReshma(env,
    "New gift lead: " + email.toLowerCase(),
    "<h2 style='color:#E8B870;'>New gift download</h2>" +
    "<p><b>Name:</b> " + (resolvedName || "not given") + "</p>" +
    "<p><b>Email:</b> " + email.toLowerCase() + "</p>" +
    "<p><b>Source:</b> " + (source || "direct") + "</p>" +
    "<p><b>Channel:</b> " + (utm_source || "") + " / " + (utm_medium || "") + "</p>"
  );
  return json({ success: true, id });
}
__name(handleLeads, "handleLeads");

// ── Member profile: onboarding answers + passport, kept per user so upgrades never lose tester data ──
async function authedUser(request, env) {
  const token = (request.headers.get("Authorization") || "").replace("Bearer ", "");
  return token ? getUserFromToken(env, token) : null;
}
__name(authedUser, "authedUser");

async function handleProfileGet(request, env) {
  const user = await authedUser(request, env);
  if (!user) return json({ error: "Not authenticated" }, 401);
  const row = await env.DB.prepare(`SELECT onboarding, passport, onboarded_at FROM profiles WHERE user_id = ?`).bind(user.id).first();
  return json({
    onboarding: row?.onboarding ? JSON.parse(row.onboarding) : null,
    passport: row?.passport ? JSON.parse(row.passport) : null,
    onboarded_at: row?.onboarded_at || null,
  });
}
__name(handleProfileGet, "handleProfileGet");

async function handleProfileSave(request, env) {
  const user = await authedUser(request, env);
  if (!user) return json({ error: "Not authenticated" }, 401);
  let body;
  try { body = await request.json(); } catch { return json({ error: "Invalid JSON body" }, 400); }
  const now = new Date().toISOString();
  const onboarding = body.onboarding ? JSON.stringify(body.onboarding).slice(0, 20000) : null;
  const passport = body.passport ? JSON.stringify(body.passport).slice(0, 200000) : null;
  const existing = await env.DB.prepare(`SELECT onboarded_at FROM profiles WHERE user_id = ?`).bind(user.id).first();
  await env.DB.prepare(
    `INSERT INTO profiles (user_id, onboarding, passport, onboarded_at, updated_at) VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET
       onboarding = COALESCE(excluded.onboarding, profiles.onboarding),
       passport = COALESCE(excluded.passport, profiles.passport),
       onboarded_at = COALESCE(profiles.onboarded_at, excluded.onboarded_at),
       updated_at = excluded.updated_at`
  ).bind(user.id, onboarding, passport, onboarding ? now : null, now).run();
  if (onboarding && !existing?.onboarded_at) {
    const o = body.onboarding;
    await notifyReshma(env,
      "New tester onboarded: " + user.email,
      "<h2 style='color:#E8B870;'>New onboarding</h2>" +
      "<p><b>Name:</b> " + escapeHtml(o.name || user.full_name || "") + "</p>" +
      "<p><b>Email:</b> " + escapeHtml(user.email) + "</p>" +
      "<p><b>Birthday:</b> " + escapeHtml(o.birthday || "") + "</p>" +
      "<p><b>Manifesting:</b> " + escapeHtml([].concat(o.areas || []).join(", ")) + "</p>" +
      "<p><b>In their words:</b> " + escapeHtml(o.desire || "") + "</p>"
    );
  }
  return json({ success: true });
}
__name(handleProfileSave, "handleProfileSave");

async function handleAsk(request, env) {
  let body;
  try { body = await request.json(); } catch { return json({ error: "Invalid JSON body" }, 400); }
  const question = String(body.question || "").trim().slice(0, 4000);
  if (!question) return json({ error: "Question required" }, 400);
  const user = await authedUser(request, env);
  const email = user?.email || (isValidEmail(body.email || "") ? body.email.toLowerCase() : null);
  await env.DB.prepare(`INSERT INTO questions (id, user_id, email, question, created_at) VALUES (?, ?, ?, ?, ?)`)
    .bind(uuid(), user?.id || null, email, question, new Date().toISOString()).run();
  await notifyReshma(env, "New question for Reshma", "<p><b>From:</b> " + escapeHtml(email || "preview visitor") + "</p><p>" + escapeHtml(question) + "</p>");
  return json({ success: true });
}
__name(handleAsk, "handleAsk");

function escapeHtml(v) {
  return String(v).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
__name(escapeHtml, "escapeHtml");

export { worker_default as default };
