/* ── PUSH NOTIFICATION SETUP ─────────────────────────────────────────────────
   Browser push notifications for morning + evening listening reminders.
   Uses the Web Notifications API — works on desktop Chrome/Firefox/Edge.
   Safari/iOS requires PWA installation (Add to Home Screen).
   Call setupNotifications() once after user logs in.
──────────────────────────────────────────────────────────────────────────────*/

export async function requestNotificationPermission() {
  if (!("Notification" in window)) return "unsupported";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  const result = await Notification.requestPermission();
  return result;
}

export function scheduleListeningReminders() {
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  // Clear any existing scheduled reminders
  const existingMorning = localStorage.getItem("shg_morning_timer");
  const existingEvening = localStorage.getItem("shg_evening_timer");
  if (existingMorning) clearTimeout(parseInt(existingMorning));
  if (existingEvening) clearTimeout(parseInt(existingEvening));

  function msUntil(hour, minute = 0) {
    const now = new Date();
    const target = new Date();
    target.setHours(hour, minute, 0, 0);
    if (target <= now) target.setDate(target.getDate() + 1);
    return target.getTime() - now.getTime();
  }

  function showReminder(title, body) {
    try {
      const n = new Notification(title, {
        body,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: "shg-reminder",
        renotify: true,
        requireInteraction: false,
      });
      n.onclick = () => { window.focus(); n.close(); };
      setTimeout(() => n.close(), 8000);
    } catch (e) {
      console.log("Notification error:", e);
    }
  }

  // Morning — 8am
  const morningMs = msUntil(8, 0);
  const morningTimer = setTimeout(() => {
    showReminder(
      "Good morning ✦ Your vault is waiting",
      "Start your day with 20 minutes of Self Hypnosis. Your subconscious is most receptive in the morning."
    );
    // Reschedule for next day
    scheduleListeningReminders();
  }, morningMs);
  localStorage.setItem("shg_morning_timer", morningTimer.toString());

  // Evening — 9pm
  const eveningMs = msUntil(21, 0);
  const eveningTimer = setTimeout(() => {
    showReminder(
      "Evening ritual ✦ Self Hypnosis Goddess",
      "Listen before sleep. Your subconscious works through the night. Open your vault."
    );
  }, eveningMs);
  localStorage.setItem("shg_evening_timer", eveningTimer.toString());

  console.log(`Reminders scheduled: morning in ${Math.round(morningMs/60000)}min, evening in ${Math.round(eveningMs/60000)}min`);
}

export function cancelReminders() {
  const m = localStorage.getItem("shg_morning_timer");
  const e = localStorage.getItem("shg_evening_timer");
  if (m) clearTimeout(parseInt(m));
  if (e) clearTimeout(parseInt(e));
  localStorage.removeItem("shg_morning_timer");
  localStorage.removeItem("shg_evening_timer");
}
