import React from 'react';
import { PortalScreenshot } from 'shg-frontend';
export function Dark() {
  return (
    <div style={{ padding:24, background:'#000', display:'flex', justifyContent:'center' }}>
      <PortalScreenshot width={300} theme="dark" />
    </div>
  );
}
