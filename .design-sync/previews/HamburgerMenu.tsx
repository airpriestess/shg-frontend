import React from 'react';
import { HamburgerMenu } from 'shg-frontend';
export function Menu() {
  return (
    <div style={{ padding:20, background:'#000', minHeight:120, display:'flex', justifyContent:'flex-end' }}>
      <HamburgerMenu onSignIn={() => {}} />
    </div>
  );
}
