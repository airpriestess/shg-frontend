import React from 'react';
import { PushNotificationToggle } from 'shg-frontend';
const C = { bg:"#080808", bg2:"#111111", bg3:"rgba(44,183,167,0.08)", bg4:"rgba(44,183,167,0.12)", nav:"#050505", cr:"#f2ece4", mu:"#c8bfb8", dim:"#e8e0d8", border:"rgba(44,183,167,0.15)", inputBg:"#1a1a1a", inputCr:"#f2ece4" };
export function Toggle() {
  return (
    <div style={{ padding:20, background:'#000', maxWidth:420 }}>
      <PushNotificationToggle userId="demo-user" C={C} />
    </div>
  );
}
