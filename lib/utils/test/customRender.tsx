import { render } from '@testing-library/react';
import messagesNb from 'lib/translations/nb.json';
import { NextIntlClientProvider } from 'next-intl';
import type { ReactElement } from 'react';
export function customRender(ui: ReactElement) {
  return render(
    <NextIntlClientProvider locale={'nb'} messages={messagesNb}>
      {ui}
    </NextIntlClientProvider>,
  );
}

export * from '@testing-library/react';
export { customRender as render };
