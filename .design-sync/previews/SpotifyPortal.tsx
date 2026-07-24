import React from 'react';
import { SpotifyPortal } from 'shg-frontend';
export function Home() {
  return (
    <SpotifyPortal
      isPreview
      forceMode="desktop"
      forceTheme="dark"
      initialTab="home"
      userTier="goddess"
      userName="Goddess"
      onHome={() => {}}
      onSignOut={() => {}}
    />
  );
}
