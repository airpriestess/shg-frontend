/* ── PUSH NOTIFICATION REMINDERS ─────────────────────────────────────────────
   Morning (8am) and evening (9pm) listening reminders.
   Works on desktop Chrome/Firefox/Edge.
   On iPhone: user must Add to Home Screen first (PWA requirement).
──────────────────────────────────────────────────────────────────────────────*/

export async function requestNotificationPermission() {
  if (!("Notification" in window)) return "unsupported";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  const result = await Notification.requestPermission();
  return result;
}

function msUntilNext(hour, minute = 0) {
  const now = new Date();
  const target = new Date();
  target.setHours(hour, minute, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1);
  return target.getTime() - now.getTime();
}

function fireNotification(title, body) {
  try {
    const n = new Notification(title, {
      body,
      icon: "/favicon.ico",
      tag: "shg-reminder",
      renotify: true,
      requireInteraction: false,
    });
    n.onclick = () => { window.focus(); n.close(); };
    setTimeout(() => n.close(), 9000);
  } catch (e) { console.warn("Notification:", e); }
}

export function scheduleReminders() {
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  // Clear any previous timers
  const prev = JSON.parse(localStorage.getItem("shg_timers") || "[]");
  prev.forEach(id => clearTimeout(id));

  const morningId = setTimeout(function fire() {
    fireNotification(
      "Good morning ✦ Your vault is waiting",
      "Start your day with Reshma's voice. Open your Audio Vault."
    );
    setTimeout(fire, 24 * 60 * 60 * 1000); // repeat daily
  }, msUntilNext(8, 0));

  const eveningId = setTimeout(function fire() {
    fireNotification(
      "Evening ritual ✦ Self Hypnosis Goddess",
      "Listen before sleep. Your subconscious works through the night."
    );
    setTimeout(fire, 24 * 60 * 60 * 1000); // repeat daily
  }, msUntilNext(21, 0));

  localStorage.setItem("shg_timers", JSON.stringify([morningId, eveningId]));
  console.log("SHG reminders scheduled: 8am + 9pm daily");
}

export function cancelReminders() {
  const prev = JSON.parse(localStorage.getItem("shg_timers") || "[]");
  prev.forEach(id => clearTimeout(id));
  localStorage.removeItem("shg_timers");
}
