import React from 'react';
import { StatCard } from 'shg-frontend';

export function Grid() {
  return (
    <div style={{ padding: 28, background: '#000', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, maxWidth: 440 }}>
      <StatCard icon="✦" value="12" label="Manifested" sub="this month" />
      <StatCard icon="🔥" value="34" label="Day streak" sub="keep going" />
      <StatCard icon="🎧" value="128" label="Sessions" sub="all time" />
      <StatCard icon="📓" value="9" label="Proof threads" sub="3 active" />
    </div>
  );
}

export function SingleAccent() {
  return (
    <div style={{ padding: 28, background: '#000', maxWidth: 240 }}>
      <StatCard icon="💫" value="£4,200" label="Unexpected income" sub="logged as proof" color="#C8860A" />
    </div>
  );
}
