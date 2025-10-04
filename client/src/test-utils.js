import { render as rtlRender, screen } from '@testing-library/react';
import { ThemeProvider } from './components/ThemeProvider';

function render(ui, options = {}) {
  return rtlRender(ui, {
    wrapper: ({ children }) => (
      <ThemeProvider>{children}</ThemeProvider>
    ),
    ...options,
  });
}

export * from '@testing-library/react';
export { render, screen };