import React from 'react';
import { ProofThumbnailStack, PROOF_ASSETS } from 'shg-frontend';
export function Stack() {
  return (
    <div style={{ padding:28, background:'#000', display:'flex', alignItems:'center', gap:20 }}>
      <ProofThumbnailStack assets={PROOF_ASSETS.slice(0,4)} size={40} />
      <span style={{ color:'#b09888', fontSize:13 }}>4 proof entries</span>
    </div>
  );
}
