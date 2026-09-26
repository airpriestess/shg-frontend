// Keeps each member's onboarding answers + passport in D1 (via the auth worker),
// so testers who later upgrade never lose their data.
const API = "https://shg-auth-worker.airpriestess.workers.dev";
const tokenOf = () => { try { return localStorage.getItem("shg_auth_token"); } catch { return null; } };

export const passportKey = (userId) => `shg_passport_${userId}`;

export async function fetchProfile() {
  const token = tokenOf();
  if (!token) return null;
  const res = await fetch(`${API}/profile`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error("Could not load your profile");
  return res.json();
}

export async function saveProfile(data) {
  const token = tokenOf();
  if (!token) return;
  const res = await fetch(`${API}/profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Could not save, please try again");
}

// Server copy wins on a fresh device; local copy is pushed back whenever it changes.
export function startPassportSync(userId, serverPassport) {
  const key = passportKey(userId);
  try {
    if (serverPassport && !localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify(serverPassport));
      window.dispatchEvent(new Event("shg-passport-updated"));
    }
  } catch {}
  let last = null, timer = null;
  const push = () => {
    let raw = null;
    try { raw = localStorage.getItem(key); } catch {}
    if (!raw || raw === last) return;
    last = raw;
    try { saveProfile({ passport: JSON.parse(raw) }).catch(() => { last = null; }); } catch {}
  };
  const soon = () => { clearTimeout(timer); timer = setTimeout(push, 1500); };
  const onHide = () => { if (document.visibilityState === "hidden") push(); };
  window.addEventListener("shg-passport-updated", soon);
  document.addEventListener("visibilitychange", onHide);
  const interval = setInterval(push, 30000);
  return () => {
    window.removeEventListener("shg-passport-updated", soon);
    document.removeEventListener("visibilitychange", onHide);
    clearInterval(interval); clearTimeout(timer);
  };
}
