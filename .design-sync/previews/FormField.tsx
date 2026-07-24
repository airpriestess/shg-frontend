import React from 'react';
import { FormField, Btn } from 'shg-frontend';
export function TextInputs() {
  return (
    <div style={{ padding:28, background:'#000', maxWidth:380 }}>
      <FormField label="Your name">
        <input defaultValue="Reshma" />
      </FormField>
      <FormField label="What are you manifesting?">
        <textarea rows={3} defaultValue="Unexpected income and a soft, certain nervous system." />
      </FormField>
      <Btn full variant="champagne">Save</Btn>
    </div>
  );
}
