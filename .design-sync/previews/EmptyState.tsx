import React from 'react';
import { EmptyState } from 'shg-frontend';

export function NoThreads() {
  return (
    <div style={{ background: '#000', padding: 12 }}>
      <EmptyState
        icon="📓"
        title="No proof threads yet"
        body="A proof thread is where you collect evidence that your desire is on its way — screenshots, voice notes, little signs. Start one and watch it fill in."
        cta="Create your first thread"
        onCta={() => {}}
      />
    </div>
  );
}

export function NoResults() {
  return (
    <div style={{ background: '#000', padding: 12 }}>
      <EmptyState
        icon="🔍"
        title="Nothing here yet"
        body="Try a different category or clear your filters to see the full vault."
      />
    </div>
  );
}
