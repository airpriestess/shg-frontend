import React from 'react';
import { DesktopMockup } from 'shg-frontend';
export function Dark() {
  return (
    <div style={{ padding:24, background:'#000', display:'flex', justifyContent:'center' }}>
      <DesktopMockup width={520} theme="dark" />
    </div>
  );
}
