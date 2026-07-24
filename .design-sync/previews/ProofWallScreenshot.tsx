import React from 'react';
import { ProofWallScreenshot } from 'shg-frontend';
export function Default() {
  return (
    <div style={{ padding:24, background:'#000', display:'flex', justifyContent:'center' }}>
      <ProofWallScreenshot width={300} theme="dark" />
    </div>
  );
}
