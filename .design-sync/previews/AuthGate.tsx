import React from 'react';
import { AuthGate } from 'shg-frontend';
export function SignIn() {
  return (
    <div style={{ background:'#000', minHeight:520 }}>
      <AuthGate onSuccess={() => {}} />
    </div>
  );
}
