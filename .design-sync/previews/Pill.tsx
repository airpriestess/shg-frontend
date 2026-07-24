import React from 'react';
import { Pill } from 'shg-frontend';
export function Colors() {
  return (
    <div style={{ display:'flex', flexWrap:'wrap', gap:10, padding:28, background:'#000' }}>
      <Pill color="champagne">528hz</Pill>
      <Pill color="rose">Featured</Pill>
      <Pill color="success">Manifested</Pill>
      <Pill color="danger">Locked</Pill>
      <Pill color="muted">Sleep Subliminal</Pill>
      <Pill color="blood">SP Return</Pill>
    </div>
  );
}
