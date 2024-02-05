import '@testing-library/jest-dom';

import { toHaveNoViolations } from 'jest-axe';
import React, { ReactElement, ReactNode } from 'react';
import { IntlProvider } from 'react-intl';
import { render as rtlRender } from '@testing-library/react';
import messagesNb from 'lib/translations/nb.json';

require('jest-fetch-mock').enableMocks();
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

expect.extend(toHaveNoViolations);

function flattenMessages(nestedMessages: object, prefix = ''): Record<string, string> {
  return Object.keys(nestedMessages).reduce((messages, key) => {
    // @ts-ignore
    let value = nestedMessages[key];
    let prefixedKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'string') {
      // @ts-ignore
      messages[prefixedKey] = value;
    } else {
      Object.assign(messages, flattenMessages(value, prefixedKey));
    }

    return messages;
  }, {});
}

function render(ui: ReactElement, { locale = 'nb', ...options } = {}) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <IntlProvider locale={locale} messages={flattenMessages(messagesNb)}>
        {children}
      </IntlProvider>
    );
  }
  return rtlRender(ui, { wrapper: Wrapper, ...options });
}
// re-export everything
export * from '@testing-library/react';

// override render method
export { render };
