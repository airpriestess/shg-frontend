import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../src/contexts/AuthContext.jsx';

// Wraps every preview so components that read router/auth context render.
// Auth network calls fire async in an effect and never block the render.
export function SHGPreviewProvider({ children }) {
  return React.createElement(
    MemoryRouter,
    null,
    React.createElement(AuthProvider, null, children)
  );
}
