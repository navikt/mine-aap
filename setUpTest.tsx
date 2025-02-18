import '@testing-library/jest-dom';

import { toHaveNoViolations } from 'jest-axe';
import React, { ReactElement, ReactNode } from 'react';
import { render as rtlRender } from '@testing-library/react';
import messagesNb from 'lib/translations/nb.json';
import { NextIntlClientProvider } from 'next-intl';

require('jest-fetch-mock').enableMocks();
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
}));

expect.extend(toHaveNoViolations);

function render(ui: ReactElement, { locale = 'nb', ...options } = {}) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <NextIntlClientProvider locale={locale} messages={messagesNb}>
        {children}
      </NextIntlClientProvider>
    );
  }
  return rtlRender(ui, { wrapper: Wrapper, ...options });
}
// re-export everything
export * from '@testing-library/react';

// override render method
export { render };
