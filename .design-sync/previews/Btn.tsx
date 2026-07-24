import React from 'react';
import { Btn } from 'shg-frontend';

const wrap: React.CSSProperties = {
  display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12,
  padding: 28, background: '#000',
};

export function Variants() {
  return (
    <div style={wrap}>
      <Btn variant="primary">Start manifesting</Btn>
      <Btn variant="champagne">Unlock Goddess Vault</Btn>
      <Btn variant="ghost">Listen to sample</Btn>
      <Btn variant="soft">Maybe later</Btn>
      <Btn variant="danger">Delete thread</Btn>
    </div>
  );
}

export function Sizes() {
  return (
    <div style={wrap}>
      <Btn size="sm" variant="champagne">Small</Btn>
      <Btn size="md" variant="champagne">Medium</Btn>
      <Btn size="lg" variant="champagne">Large</Btn>
    </div>
  );
}

export function States() {
  return (
    <div style={{ ...wrap, flexDirection: 'column', alignItems: 'stretch', maxWidth: 320 }}>
      <Btn variant="champagne">Enabled</Btn>
      <Btn variant="champagne" disabled>Disabled</Btn>
      <Btn variant="ghost" full>Full width — begin your practice</Btn>
    </div>
  );
}
