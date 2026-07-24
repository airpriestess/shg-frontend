import React from 'react';
import { ArrowIcon } from 'shg-frontend';
export function Sizes() {
  return (
    <div style={{ padding:28, background:'#000', display:'flex', alignItems:'center', gap:24, color:'#2CB7A7' }}>
      <span style={{ display:'inline-flex', alignItems:'center', gap:6, color:'#f2ece4', fontSize:14 }}>Continue <ArrowIcon size={14} /></span>
      <ArrowIcon size={20} color="#C8860A" />
      <ArrowIcon size={32} color="#2CB7A7" />
    </div>
  );
}
