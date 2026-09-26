import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.jsx'
import App from './App.jsx'
import './index.css'
import './styles/shg-theme.css'
// Opened from the home screen icon: go straight to the portal (the last one used, e.g. the beta).
try {
  const standalone = window.navigator.standalone || window.matchMedia("(display-mode: standalone)").matches;
  if (standalone && window.location.pathname === "/") {
    window.location.replace(localStorage.getItem("shg_last_portal") || "/portal");
  }
} catch {}
if (window.location.pathname.startsWith("/portal")) {
  try { localStorage.setItem("shg_last_portal", window.location.pathname + window.location.search); } catch {}
}
// The shop lives on Beacons.
if (/^\/+shop\/?$/i.test(window.location.pathname)) {
  window.location.replace("https://beacons.ai/reshmaoracle");
}
// Short investor links: /demo and /beta open the live beta portal in preview.
if (/^\/+(demo|beta)\/?$/i.test(window.location.pathname)) {
  window.history.replaceState(null, "", "/portal?preview=1");
}
// Tidy links with stray double slashes (e.g. reshmaoracle.com//portal) so they still open the right page.
if (/\/\/+/.test(window.location.pathname)) {
  window.history.replaceState(null, "", window.location.pathname.replace(/\/\/+/g, "/") + window.location.search + window.location.hash);
}
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><BrowserRouter><AuthProvider><App /></AuthProvider></BrowserRouter></React.StrictMode>
)

// Unregister any existing service workers to prevent PWA app install behaviour
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(regs => {
    regs.forEach(reg => reg.unregister());
  });
}
