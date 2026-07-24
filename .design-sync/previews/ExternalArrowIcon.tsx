import React from 'react';
import { ExternalArrowIcon } from 'shg-frontend';
export function Sizes() {
  return (
    <div style={{ padding:28, background:'#000', display:'flex', alignItems:'center', gap:24 }}>
      <span style={{ display:'inline-flex', alignItems:'center', gap:6, color:'#f2ece4', fontSize:14 }}>Open in Spotify <ExternalArrowIcon size={14} color="#2CB7A7" /></span>
      <ExternalArrowIcon size={22} color="#C8860A" />
      <ExternalArrowIcon size={32} color="#5B8DB8" />
    </div>
  );
}
