import React from 'react';
import { ProgressBar } from 'shg-frontend';
export function Levels() {
  return (
    <div style={{ padding:28, background:'#000', display:'grid', gap:18, maxWidth:360 }}>
      <div>
        <div style={{ color:'#b09888', fontSize:12, marginBottom:8 }}>Installation · 30%</div>
        <ProgressBar value={30} max={100} />
      </div>
      <div>
        <div style={{ color:'#b09888', fontSize:12, marginBottom:8 }}>Installation · 70%</div>
        <ProgressBar value={70} max={100} />
      </div>
      <div>
        <div style={{ color:'#b09888', fontSize:12, marginBottom:8 }}>Complete</div>
        <ProgressBar value={100} max={100} />
      </div>
    </div>
  );
}
