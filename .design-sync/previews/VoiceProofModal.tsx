import React from 'react';
import { VoiceProofModal } from 'shg-frontend';
export function Open() {
  return <VoiceProofModal open onClose={() => {}} onSaved={() => {}} threadId="t1" audioTitle="Money Finds Me First" />;
}
