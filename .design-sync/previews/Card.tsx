import React from 'react';
import { Card, Pill, Btn } from 'shg-frontend';

const page: React.CSSProperties = { padding: 28, background: '#000', display: 'grid', gap: 16, maxWidth: 380 };

export function Default() {
  return (
    <div style={page}>
      <Card style={{ padding: 24 }}>
        <Pill color="champagne">528hz</Pill>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#f2ece4', margin: '12px 0 6px' }}>
          Money Finds Me First
        </div>
        <div style={{ fontSize: 14, color: '#b09888', lineHeight: 1.7 }}>
          Subconscious reprogramming for receiving — money, opportunities, unexpected
          income. Layered with 528hz transformation frequency and bilateral subliminal
          affirmations.
        </div>
      </Card>
    </div>
  );
}

export function Premium() {
  return (
    <div style={page}>
      <Card premium style={{ padding: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#f2ece4', marginBottom: 8 }}>
          The Goddess Vault
        </div>
        <div style={{ fontSize: 14, color: '#b09888', lineHeight: 1.7, marginBottom: 18 }}>
          Deeper audios, more storage, and the full evidence vault — everything your
          practice needs to compound.
        </div>
        <Btn variant="champagne" size="sm">Upgrade</Btn>
      </Card>
    </div>
  );
}

export function Interactive() {
  return (
    <div style={page}>
      <Card hover onClick={() => {}} style={{ padding: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#dcc8b8' }}>
          Gorgeous Is My Default Setting
        </div>
        <div style={{ fontSize: 13, color: '#786860', marginTop: 4 }}>
          Tap to open · last listened 2 days ago
        </div>
      </Card>
    </div>
  );
}
