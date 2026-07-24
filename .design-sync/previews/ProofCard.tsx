import React from 'react';
import { ProofCard, PROOF_ASSETS } from 'shg-frontend';
export function Cards() {
  return (
    <div style={{ padding:28, background:'#000', display:'flex', flexWrap:'wrap', gap:14 }}>
      {PROOF_ASSETS.slice(0,4).map((a,i) => (
        <ProofCard key={i} asset={a} size={96} radius={10} showLabel />
      ))}
    </div>
  );
}
