import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase.js";

const VAPID_PUBLIC = "BAngNYNtiFBh14NCA0yqlLovaDzYt30BFLgvkuU-_nxPAyR6idGyLiaY6chM8YYVme8p1eMLnvxIqMogy_RNMXg";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from(rawData, c => c.charCodeAt(0));
}

export function usePushNotifications(userId) {
  const [permission, setPermission] = useState(() =>
    "Notification" in window ? Notification.permission : "unavailable"
  );
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if already subscribed
  useEffect(() => {
    if (!("serviceWorker" in navigator) || !userId) return;
    navigator.serviceWorker.ready.then(async reg => {
      const sub = await reg.pushManager.getSubscription();
      setSubscribed(!!sub);
    });
  }, [userId]);

  async function subscribe() {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      alert("Push notifications are not supported in this browser. On iPhone, add this page to your Home Screen first.");
      return;
    }

    setLoading(true);
    try {
      // Request permission
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== "granted") { setLoading(false); return; }

      // Register service worker if not already
      const reg = await navigator.serviceWorker.register("/service-worker.js", { scope: "/" });
      await navigator.serviceWorker.ready;

      // Subscribe to push
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC),
      });

      const subJson = sub.toJSON();

      // Save to Supabase
      const { error } = await supabase.from("push_subscriptions").upsert({
        user_id: userId,
        endpoint: subJson.endpoint,
        p256dh: subJson.keys.p256dh,
        auth: subJson.keys.auth,
        user_agent: navigator.userAgent.slice(0, 200),
      }, { onConflict: "endpoint" });

      if (error) throw error;
      setSubscribed(true);
    } catch (err) {
      console.error("Push subscription failed:", err);
    } finally {
      setLoading(false);
    }
  }

  async function unsubscribe() {
    setLoading(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await supabase.from("push_subscriptions").delete().eq("endpoint", sub.endpoint);
        await sub.unsubscribe();
      }
      setSubscribed(false);
    } catch (err) {
      console.error("Unsubscribe failed:", err);
    } finally {
      setLoading(false);
    }
  }

  return { permission, subscribed, loading, subscribe, unsubscribe };
}

// ── UI COMPONENT — shown in profile menu / settings ──
export function PushNotificationToggle({ userId, C }) {
  const { permission, subscribed, loading, subscribe, unsubscribe } = usePushNotifications(userId);

  const isUnsupported = permission === "unavailable" || !("PushManager" in window);
  const isDenied = permission === "denied";

  return (
    <div style={{ padding: "12px 16px", borderTop: `0.5px solid ${C?.border || "#2a2020"}` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: C?.cr || "#f2ece4", marginBottom: 2 }}>
            🔔 Daily reminders
          </div>
          <div style={{ fontSize: 11, color: C?.mu || "#7a6a60", lineHeight: 1.4 }}>
            {isUnsupported
              ? "Add to Home Screen on iPhone to enable"
              : isDenied
              ? "Blocked in browser settings"
              : subscribed
              ? "On — you'll hear when new tracks drop"
              : "Get notified when new tracks drop"}
          </div>
        </div>
        {!isUnsupported && !isDenied && (
          <button
            onClick={subscribed ? unsubscribe : subscribe}
            disabled={loading}
            style={{
              width: 44, height: 26, borderRadius: 13, border: "none", cursor: loading ? "not-allowed" : "pointer",
              background: subscribed ? "#e8a860" : "#2a2020",
              position: "relative", flexShrink: 0, transition: "background 0.2s",
            }}
          >
            <span style={{
              position: "absolute", top: 3, left: subscribed ? 21 : 3,
              width: 20, height: 20, borderRadius: "50%",
              background: "#fff", transition: "left 0.2s", display: "block",
            }}/>
          </button>
        )}
      </div>
    </div>
  );
}

// ── PROMPT BANNER — shows after 3rd session if not subscribed ──
export function PushPromptBanner({ userId, C, onDismiss }) {
  const { permission, subscribed, loading, subscribe } = usePushNotifications(userId);

  if (subscribed || permission === "granted" || permission === "denied" || permission === "unavailable") return null;

  return (
    <div style={{
      margin: "0 16px 16px", padding: "14px 16px", borderRadius: 14,
      background: "#0a0a0a", border: "1px solid rgba(200,134,10,0.3)",
      display: "flex", alignItems: "center", gap: 12,
    }}>
      <span style={{ fontSize: 22, flexShrink: 0 }}>🔔</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C?.cr || "#f2ece4", marginBottom: 2 }}>
          Never miss a new drop
        </div>
        <div style={{ fontSize: 11, color: C?.mu || "#7a6a60" }}>
          Get notified when Reshma uploads new tracks.
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
        <button
          onClick={onDismiss}
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: C?.mu || "#7a6a60", padding: "0 4px" }}
        >✕</button>
        <button
          onClick={subscribe}
          disabled={loading}
          style={{
            background: "linear-gradient(135deg,#C8860A,#e8a860)", border: "none", borderRadius: 8,
            padding: "7px 14px", fontSize: 12, fontWeight: 700, color: "#000", cursor: "pointer",
          }}
        >
          {loading ? "..." : "Allow"}
        </button>
      </div>
    </div>
  );
}
