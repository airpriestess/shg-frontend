import React from 'react';
import { WaveForm } from 'shg-frontend';
export function Playing() {
  return (
    <div style={{ padding:28, background:'#000', display:'flex', alignItems:'center', gap:14 }}>
      <div style={{ width:40, height:40, borderRadius:'50%', background:'linear-gradient(135deg,#5B8DB8,#2CB7A7)', display:'flex', alignItems:'center', justifyContent:'center', color:'#000', fontSize:16 }}>▶</div>
      <div>
        <div style={{ color:'#f2ece4', fontSize:14, fontWeight:600, marginBottom:6 }}>Money Finds Me First</div>
        <WaveForm playing />
      </div>
    </div>
  );
}
export function Paused() {
  return (
    <div style={{ padding:28, background:'#000' }}>
      <WaveForm playing={false} />
    </div>
  );
}
