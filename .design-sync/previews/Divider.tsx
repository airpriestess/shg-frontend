import React from 'react';
import { Divider } from 'shg-frontend';
export function Default() {
  return (
    <div style={{ padding:28, background:'#000', maxWidth:340 }}>
      <div style={{ color:'#dcc8b8', fontSize:15 }}>Your practice</div>
      <Divider style={{ margin:'16px 0' }} />
      <div style={{ color:'#786860', fontSize:13 }}>34-day streak · 128 sessions</div>
    </div>
  );
}
