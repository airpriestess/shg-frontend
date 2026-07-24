import React from 'react';
import { CreateThreadModal } from 'shg-frontend';
export function Open() {
  return <CreateThreadModal open onClose={() => {}} preselectedAudioId={1} />;
}
