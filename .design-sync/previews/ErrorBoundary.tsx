import React from 'react';
import { ErrorBoundary } from 'shg-frontend';
function Boom(): React.ReactElement {
  throw new Error('Something went sideways');
}
export function Fallback() {
  return (
    <div style={{ background:'#000', padding:16 }}>
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>
    </div>
  );
}
