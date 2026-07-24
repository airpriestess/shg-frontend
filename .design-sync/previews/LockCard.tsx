import React from 'react';
import { LockCard } from 'shg-frontend';
export function Default() {
  return (
    <div style={{ padding:20, background:'#000', maxWidth:360 }}>
      <LockCard onUpgrade={() => {}} />
    </div>
  );
}
