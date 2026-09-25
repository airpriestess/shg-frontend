var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

var CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });
}
__name(json, "json");

async function getUserFromToken(env, token) {
  if (!token) return null;
  const session = await env.DB.prepare(
    `SELECT s.user_id, s.expires_at FROM sessions s WHERE s.token = ?`
  ).bind(token).first();
  if (!session) return null;
  if (new Date(session.expires_at) < new Date()) return null;
  return session.user_id;
}
__name(getUserFromToken, "getUserFromToken");

var worker_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS });
    }
    if (url.pathname === "/waitlist" && request.method === "POST") {
      return handleWaitlist(request, env);
    }
    if (url.pathname === "/blog-subscribe" && request.method === "POST") {
      return handleBlogSubscribe(request, env);
    }
    if (url.pathname === "/track-view" && request.method === "POST") {
      return handleTrackView(request, env);
    }
    if (url.pathname === "/log-listen" && request.method === "POST") {
      return handleLogListen(request, env);
    }
    if (url.pathname === "/recommend" && request.method === "POST") {
      return handleRecommend(request, env);
    }
    if (url.pathname === "/reminder" && request.method === "POST") {
      return handleReminder(request, env);
    }
    if (url.pathname === "/listen-history" && request.method === "GET") {
      return handleListenHistory(request, env);
    }
    // ── ProofOS thread persistence ─────────────────────────────────────────
    if (url.pathname === "/threads" && request.method === "GET") {
      return handleGetThreads(request, env);
    }
    if (url.pathname === "/threads" && request.method === "POST") {
      return handleSaveThread(request, env);
    }
    if (url.pathname.startsWith("/threads/") && request.method === "PATCH") {
      return handleUpdateThread(request, env, url.pathname.slice(9));
    }
    if (url.pathname.startsWith("/threads/") && request.method === "DELETE") {
      return handleDeleteThread(request, env, url.pathname.slice(9));
    }
    if (url.pathname.match(/^\/threads\/[^/]+\/signs$/) && request.method === "POST") {
      const threadId = url.pathname.split("/")[2];
      return handleAddSign(request, env, threadId);
    }
    if (url.pathname.match(/^\/threads\/[^/]+\/signs\/\d+$/) && request.method === "DELETE") {
      const parts = url.pathname.split("/");
      return handleDeleteSign(request, env, parts[2], parts[4]);
    }
    if (url.pathname === "/organize" && request.method === "POST") {
      return handleOrganize(request, env);
    }
    if (url.pathname === "/ask" && request.method === "POST") {
      return handleAskReshma(request, env);
    }
    if (url.pathname === "/ask" && request.method === "GET") {
      return handleGetQuestions(request, env);
    }
    if (request.method === "POST") {
      return handleQuizLead(request, env);
    }
    return json({ error: "Not found" }, 404);
  },
};

// ── ORGANIZE: voice notes and journal photos into intentions, signs, arrivals ──
// Reads what she said (or photos of her journal pages) and returns a list for
// her to confirm. Nothing is saved here; the app saves only what she ticks.
const ORGANIZE_CATEGORIES = ["Luckygirlmaxxing","Lovemaxxing","Richgirlmaxxing","Beautymaxxing","Selfmaxxing","Sleepmaxxing","Healthmaxxing","Bodymaxxing","Businessmaxxing","Friendmaxxing","DNAmaxxing","Sovereignmaxxing","Lifemaxxing"];
async function handleOrganize(request, env) {
  const userId = await authUser(request, env);
  if (!userId) return json({ error: "Not authenticated" }, 401);
  if (!env.ANTHROPIC_API_KEY) return json({ error: "AI not configured" }, 503);
  let body;
  try { body = await request.json(); } catch { return json({ error: "Invalid JSON" }, 400); }
  const text = String(body.text || "").slice(0, 8000);
  const images = Array.isArray(body.images) ? body.images.slice(0, 6) : [];
  const threads = Array.isArray(body.threads) ? body.threads.slice(0, 80) : [];
  if (!text && !images.length) return json({ error: "Nothing to organize" }, 400);
  const today = new Date().toISOString().slice(0, 10);
  const prompt = `You organise entries for proofOS, a manifestation evidence tracker. Today is ${today}.
She has ${images.length ? "uploaded photos of her handwritten journal or wish list" : "spoken a voice note"}. Split it into separate items. For each item decide:
- "intention": something she wants or is calling in (write it in present tense, as she would, e.g. "He texts me first").
- "sign": something that happened that she sees as a sign or synchronicity for an intention.
- "arrived": an intention that has already come true.
- "bucket": a loose wish with no active focus yet.
Match signs and arrivals to one of her existing intentions when it clearly fits; use its id as thread_id. Otherwise thread_id is null.
Pick one category from: ${ORGANIZE_CATEGORIES.join(", ")}.
date: YYYY-MM-DD if she gave or implied a date (today, yesterday, last year becomes ${Number(today.slice(0,4)) - 1}-01-01), else null. date_label: her words for the time ("last year", "this morning") or null.
Keep her wording. Do not invent anything she did not say or write.
Her existing intentions: ${JSON.stringify(threads.map(t => ({ id: t.id, desire: t.desire })))}
${text ? `What she said:\n"""${text}"""` : ""}
Reply with ONLY JSON: {"items":[{"type":"intention|sign|arrived|bucket","text":"...","category":"...","thread_id":null,"date":null,"date_label":null}]}`;
  const content = [
    ...images.map(d => {
      const m = /^data:(image\/(?:jpeg|png|webp|gif));base64,(.+)$/.exec(String(d));
      return m ? { type: "image", source: { type: "base64", media_type: m[1], data: m[2] } } : null;
    }).filter(Boolean),
    { type: "text", text: prompt },
  ];
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model: "claude-haiku-4-5-20251001", max_tokens: 2000, messages: [{ role: "user", content }] }),
    });
    const data = await res.json();
    const raw = data.content?.[0]?.text || "";
    const match = raw.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(match ? match[0] : raw);
    const ids = new Set(threads.map(t => t.id));
    const items = (parsed.items || []).filter(i => i && i.text && ["intention","sign","arrived","bucket"].includes(i.type)).slice(0, 40).map(i => ({
      type: i.type, text: String(i.text).slice(0, 300),
      category: ORGANIZE_CATEGORIES.includes(i.category) ? i.category : "",
      thread_id: ids.has(i.thread_id) ? i.thread_id : null,
      date: /^\d{4}-\d{2}-\d{2}$/.test(i.date || "") ? i.date : null,
      date_label: i.date_label ? String(i.date_label).slice(0, 40) : null,
    }));
    return json({ items });
  } catch (err) {
    return json({ error: "Could not organize that", detail: err.message }, 500);
  }
}
__name(handleOrganize, "handleOrganize");

// ── EXISTING HANDLERS ─────────────────────────────────────────────────────────

async function handleQuizLead(request, env) {
  try {
    const { name, email, result_category, source } = await request.json();
    if (!email || !source) {
      return json({ error: "Missing required fields: email, source" }, 400);
    }
    const existing = await env.DB.prepare(
      `SELECT id, result_category FROM quiz_leads WHERE email = ? AND source = ? ORDER BY created_at DESC LIMIT 1`
    ).bind(email, source).first();

    if (existing && result_category) {
      // Second call from quiz result screen — update the existing row
      await env.DB.prepare(
        `UPDATE quiz_leads SET result_category = ? WHERE id = ?`
      ).bind(result_category, existing.id).run();
      await addToNitrosend(env, email, { source, result_category });
    } else if (!existing) {
      // New lead — first submission
      await env.DB.prepare(
        `INSERT INTO quiz_leads (name, email, result_category, source) VALUES (?, ?, ?, ?)`
      ).bind(name || null, email, result_category || null, source).run();
      await addToNitrosend(env, email, { source, name: name || undefined, result_category: result_category || undefined });
    }
    // existing already has result_category — idempotent, do nothing
    return json({ success: true });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
__name(handleQuizLead, "handleQuizLead");

async function addToNitrosend(env, email, tags, firstName) {
  if (!env.NITROSEND_API_KEY) return;
  try {
    await fetch("https://api.nitrosend.com/v1/my/contacts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.NITROSEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, opt_in: true, tags, ...(firstName ? { first_name: firstName } : {}) }),
    });
  } catch (err) {
    console.error("Nitrosend sync failed:", err.message);
  }
}
__name(addToNitrosend, "addToNitrosend");

async function handleTrackView(request, env) {
  try {
    const { page, referrer, utm_source, utm_medium, utm_campaign } = await request.json();
    if (!page) return json({ error: "Missing required field: page" }, 400);
    const country = request.cf?.country || null;
    const city = request.cf?.city || null;
    await env.DB.prepare(
      `INSERT INTO page_views (page, referrer, utm_source, utm_medium, utm_campaign, country, city)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(page, referrer || null, utm_source || null, utm_medium || null, utm_campaign || null, country, city).run();
    return json({ success: true });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
__name(handleTrackView, "handleTrackView");

async function handleBlogSubscribe(request, env) {
  try {
    const { email, first_name, source } = await request.json();
    if (!email) return json({ error: "Missing required field: email" }, 400);
    let alreadyExists = false;
    try {
      await env.DB.prepare(
        `INSERT INTO blog_subscribers (email, first_name, source) VALUES (?, ?, ?)`
      ).bind(email, first_name || null, source || null).run();
    } catch (dbErr) {
      if (String(dbErr.message || "").toUpperCase().includes("UNIQUE")) {
        alreadyExists = true;
      } else {
        throw dbErr;
      }
    }
    await addToNitrosend(env, email, { source: source || "blog" }, first_name);
    return json({ success: true, alreadyExists });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
__name(handleBlogSubscribe, "handleBlogSubscribe");


async function notifyReshma(env, subject, body) {
  try {
    await fetch("https://api.nitrosend.com/v1/transactional/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + env.NITROSEND_API_KEY
      },
      body: JSON.stringify({
        to: "reshma@reshmaoracle.com",
        from: "noreply@reshmaoracle.com",
        subject: subject,
        html: "<div style='font-family:sans-serif;padding:20px;background:#000;color:#fdf0e8;'>" + body + "</div>"
      })
    });
  } catch(e) {}
}

async function handleWaitlist(request, env) {
  try {
    const { email, first_name, source } = await request.json();
    if (!email) return json({ error: "Missing required field: email" }, 400);
    let alreadyExists = false;
    try {
      await env.DB.prepare(
        `INSERT INTO waitlist (email, first_name, source) VALUES (?, ?, ?)`
      ).bind(email, first_name || null, source || null).run();
    } catch (dbErr) {
      if (String(dbErr.message || "").toUpperCase().includes("UNIQUE")) {
        alreadyExists = true;
      } else {
        throw dbErr;
      }
    }
    await addToNitrosend(env, email, { source: source || "waitlist" }, first_name);
    if (!alreadyExists) {
      await notifyReshma(env,
        "New waitlist signup: " + email,
        "<h2 style='color:#BFA5D8;'>New waitlist signup</h2>" +
        "<p><b>Name:</b> " + (first_name || "not given") + "</p>" +
        "<p><b>Email:</b> " + email + "</p>" +
        "<p><b>Source:</b> " + (source || "direct") + "</p>"
      );
    }
    return json({ success: true, alreadyExists });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
__name(handleWaitlist, "handleWaitlist");

// ── NEW HANDLERS ──────────────────────────────────────────────────────────────

async function handleLogListen(request, env) {
  const authHeader = request.headers.get("Authorization") || "";
  const token = authHeader.replace("Bearer ", "");
  const userId = await getUserFromToken(env, token);
  if (!userId) return json({ error: "Not authenticated" }, 401);

  let body;
  try { body = await request.json(); } catch { return json({ error: "Invalid JSON" }, 400); }

  const { track_id, title, category, duration_seconds, completed } = body;
  const id = crypto.randomUUID();
  const played_at = new Date().toISOString();

  await env.DB.prepare(
    `INSERT INTO listening_events (id, user_id, track_id, title, category, duration_seconds, completed, played_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(id, userId, track_id || null, title || null, category || null, duration_seconds || 0, completed ? 1 : 0, played_at).run();

  return json({ success: true, id });
}
__name(handleLogListen, "handleLogListen");

async function handleRecommend(request, env) {
  const authHeader = request.headers.get("Authorization") || "";
  const token = authHeader.replace("Bearer ", "");
  const userId = await getUserFromToken(env, token);
  if (!userId) return json({ error: "Not authenticated" }, 401);

  if (!env.ANTHROPIC_API_KEY) return json({ error: "AI not configured" }, 503);

  let body;
  try { body = await request.json(); } catch { return json({ error: "Invalid JSON" }, 400); }
  const { tracks = [], recentPlays = [] } = body;

  const prompt = `You are the recommendation engine for Self Hypnosis Goddess, a hypnosis audio app for women.

The user's recent listening history (most recent first):
${JSON.stringify(recentPlays.slice(0, 20).map(p => ({ title: p.title, category: p.category, completed: !!p.completed })), null, 2)}

Available tracks (title and category only):
${JSON.stringify(tracks.map(t => ({ title: t.title, category: t.cat })), null, 2)}

Based on the user's patterns — what they listen to most, what categories they favour, and what they haven't explored yet — recommend exactly ONE track as their next listen.

Respond with ONLY valid JSON, no other text:
{"title": "exact track title from the list", "category": "category name", "reason": "one sentence (max 15 words) explaining why this track is perfect for her right now"}`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 200,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const data = await res.json();
    const text = data.content?.[0]?.text || "";
    const rec = JSON.parse(text);
    return json({ recommendation: rec });
  } catch (err) {
    return json({ error: "AI recommendation failed", detail: err.message }, 500);
  }
}
__name(handleRecommend, "handleRecommend");

async function handleReminder(request, env) {
  const authHeader = request.headers.get("Authorization") || "";
  const token = authHeader.replace("Bearer ", "");
  const userId = await getUserFromToken(env, token);
  if (!userId) return json({ error: "Not authenticated" }, 401);

  let body;
  try { body = await request.json(); } catch { return json({ error: "Invalid JSON" }, 400); }
  const { email, first_name, reminder_time = "20:00" } = body;

  if (email && env.NITROSEND_API_KEY) {
    await addToNitrosend(env, email, { daily_reminder: true, reminder_time }, first_name);
  }

  return json({ success: true });
}
__name(handleReminder, "handleReminder");

async function handleListenHistory(request, env) {
  const authHeader = request.headers.get("Authorization") || "";
  const token = authHeader.replace("Bearer ", "");
  const userId = await getUserFromToken(env, token);
  if (!userId) return json({ error: "Not authenticated" }, 401);

  const result = await env.DB.prepare(
    `SELECT id, track_id, title, category, duration_seconds, completed, played_at
     FROM listening_events WHERE user_id = ? ORDER BY played_at DESC LIMIT 200`
  ).bind(userId).all();

  return json({ events: result.results || [] });
}
__name(handleListenHistory, "handleListenHistory");

// ── PROOFOS THREAD HANDLERS ───────────────────────────────────────────────────

async function authUser(request, env) {
  const token = (request.headers.get("Authorization") || "").replace("Bearer ", "");
  return getUserFromToken(env, token);
}

async function handleGetThreads(request, env) {
  const userId = await authUser(request, env);
  if (!userId) return json({ error: "Not authenticated" }, 401);

  const threads = await env.DB.prepare(
    `SELECT * FROM proof_threads WHERE user_id = ? ORDER BY created_at ASC`
  ).bind(userId).all();

  const signs = await env.DB.prepare(
    `SELECT * FROM proof_signs WHERE user_id = ? ORDER BY created_at ASC`
  ).bind(userId).all();

  const signsByThread = {};
  for (const s of (signs.results || [])) {
    if (!signsByThread[s.thread_id]) signsByThread[s.thread_id] = [];
    signsByThread[s.thread_id].push(s);
  }

  const result = (threads.results || []).map(t => ({
    ...t,
    done: t.done === 1,
    is_bucket: t.is_bucket === 1,
    signs: signsByThread[t.id] || [],
  }));

  return json({ threads: result });
}

async function handleSaveThread(request, env) {
  const userId = await authUser(request, env);
  if (!userId) return json({ error: "Not authenticated" }, 401);

  let body;
  try { body = await request.json(); } catch { return json({ error: "Invalid JSON" }, 400); }

  const { id, desire, category = "", track = "", old_belief = "", feel_before = "", is_bucket = false } = body;
  if (!id || !desire) return json({ error: "id and desire are required" }, 400);

  await env.DB.prepare(
    `INSERT INTO proof_threads (id, user_id, desire, category, track, old_belief, feel_before, is_bucket)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET desire=excluded.desire, category=excluded.category,
       track=excluded.track, old_belief=excluded.old_belief, feel_before=excluded.feel_before,
       is_bucket=excluded.is_bucket, updated_at=datetime('now')`
  ).bind(id, userId, desire, category, track, old_belief, feel_before, is_bucket ? 1 : 0).run();

  return json({ success: true, id });
}

async function handleUpdateThread(request, env, threadId) {
  const userId = await authUser(request, env);
  if (!userId) return json({ error: "Not authenticated" }, 401);

  let body;
  try { body = await request.json(); } catch { return json({ error: "Invalid JSON" }, 400); }

  const fields = [];
  const vals = [];
  const allowed = ["desire","category","track","old_belief","feel_before","feel_after","days","done","is_bucket","manifested_at"];
  for (const [k, v] of Object.entries(body)) {
    if (allowed.includes(k)) {
      fields.push(`${k}=?`);
      vals.push(typeof v === "boolean" ? (v ? 1 : 0) : v);
    }
  }
  if (fields.length === 0) return json({ error: "No valid fields" }, 400);
  fields.push("updated_at=datetime('now')");
  vals.push(threadId, userId);

  await env.DB.prepare(
    `UPDATE proof_threads SET ${fields.join(",")} WHERE id=? AND user_id=?`
  ).bind(...vals).run();

  return json({ success: true });
}

async function handleDeleteThread(request, env, threadId) {
  const userId = await authUser(request, env);
  if (!userId) return json({ error: "Not authenticated" }, 401);

  await env.DB.prepare(
    `DELETE FROM proof_signs WHERE thread_id=? AND user_id=?`
  ).bind(threadId, userId).run();
  await env.DB.prepare(
    `DELETE FROM proof_threads WHERE id=? AND user_id=?`
  ).bind(threadId, userId).run();

  return json({ success: true });
}

async function handleAddSign(request, env, threadId) {
  const userId = await authUser(request, env);
  if (!userId) return json({ error: "Not authenticated" }, 401);

  let body;
  try { body = await request.json(); } catch { return json({ error: "Invalid JSON" }, 400); }

  const { text, date, img, audio } = body;

  const result = await env.DB.prepare(
    `INSERT INTO proof_signs (thread_id, user_id, text, date, img, audio) VALUES (?, ?, ?, ?, ?, ?)`
  ).bind(threadId, userId, text || null, date || null, img || null, audio || null).run();

  return json({ success: true, id: result.meta.last_row_id });
}

async function handleDeleteSign(request, env, threadId, signId) {
  const userId = await authUser(request, env);
  if (!userId) return json({ error: "Not authenticated" }, 401);

  await env.DB.prepare(
    `DELETE FROM proof_signs WHERE id=? AND thread_id=? AND user_id=?`
  ).bind(signId, threadId, userId).run();

  return json({ success: true });
}

// ── ASK RESHMA ────────────────────────────────────────────────────────────────

async function handleAskReshma(request, env) {
  const userId = await authUser(request, env);
  if (!userId) return json({ error: "Not authenticated" }, 401);

  let body;
  try { body = await request.json(); } catch { return json({ error: "Invalid JSON" }, 400); }

  const { question, email } = body;
  if (!question || !question.trim()) return json({ error: "Question is required" }, 400);
  if (question.trim().length > 1000) return json({ error: "Question too long (max 1000 chars)" }, 400);

  const result = await env.DB.prepare(
    `INSERT INTO reshma_questions (user_id, email, question) VALUES (?, ?, ?)`
  ).bind(userId, email || null, question.trim()).run();

  // Notify via Nitrosend if configured
  if (env.NITROSEND_API_KEY && env.RESHMA_NOTIFY_EMAIL) {
    try {
      await fetch("https://api.nitrosend.com/v1/transactional/send", {
        method: "POST",
        headers: { Authorization: `Bearer ${env.NITROSEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          to: env.RESHMA_NOTIFY_EMAIL,
          subject: "New question from a Goddess member",
          text: `Question #${result.meta.last_row_id}\nFrom: ${email || userId}\n\n${question.trim()}`,
        }),
      });
    } catch {}
  }

  return json({ success: true, id: result.meta.last_row_id });
}

async function handleGetQuestions(request, env) {
  const userId = await authUser(request, env);
  if (!userId) return json({ error: "Not authenticated" }, 401);

  const result = await env.DB.prepare(
    `SELECT id, question, status, answer, answered_at, created_at FROM reshma_questions WHERE user_id=? ORDER BY created_at DESC LIMIT 20`
  ).bind(userId).all();

  return json({ questions: result.results || [] });
}

export { worker_default as default };
