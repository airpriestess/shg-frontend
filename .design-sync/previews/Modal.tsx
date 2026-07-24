import React from 'react';
import { Modal, Btn, FormField } from 'shg-frontend';

export function LogASign() {
  return (
    <Modal open title="Log a Sign" onClose={() => {}} width={460}>
      <FormField label="What did you notice?">
        <textarea
          rows={3}
          defaultValue="A friend randomly offered to cover lunch — money finding me first, again."
        />
      </FormField>
      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <Btn full variant="champagne">Save Sign</Btn>
        <Btn variant="soft">Cancel</Btn>
      </div>
    </Modal>
  );
}
