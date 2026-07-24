import React from 'react';
import { Rings } from 'shg-frontend';
export function Halo() {
  return (
    <div style={{ position:'relative', height:280, background:'#000', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <Rings count={4} />
      <div className="wm" style={{ position:'relative', fontSize:34, color:'#C8860A', zIndex:1 }}>
        Self Hypnosis Goddess
      </div>
    </div>
  );
}
