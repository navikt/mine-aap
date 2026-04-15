import { cleanup, render } from '@testing-library/react';
import { ReactElement } from 'react';
import { afterEach } from 'vitest';
import { NextIntlClientProvider } from 'next-intl';
import messagesNb from 'lib/translations/nb.json';

afterEach(() => {
  cleanup();
});

export function customRender(ui: ReactElement) {
  return render(
    <NextIntlClientProvider locale={'nb'} messages={messagesNb}>
      {ui}
    </NextIntlClientProvider>
  );
}

export * from '@testing-library/react';
export { customRender as render };
