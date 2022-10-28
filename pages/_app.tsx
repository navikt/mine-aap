import '@navikt/ds-css';
import '@navikt/aap-felles-innbygger-css';
import 'styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { initAmplitude } from 'lib/utils/amplitude';
import messagesNb from 'lib/translations/nb.json';
import messagesNn from 'lib/translations/nn.json';
import { IntlProvider } from 'react-intl';
import { useRouter } from 'next/router';
import { Locale } from '@navikt/nav-dekoratoren-moduler';
import { SUPPORTED_LOCALE } from 'lib/translations/locales';
import { NavDecorator } from 'components/NavDecorator/NavDecorator';

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

const getLocaleOrFallback = (locale?: string) => {
  if (locale && SUPPORTED_LOCALE.includes(locale)) {
    return locale;
  }

  return 'nb';
};

type Messages = {
  [K in Locale]?: { [name: string]: string };
};

export const messages: Messages = {
  nb: flattenMessages(messagesNb),
  nn: flattenMessages(messagesNn),
};

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const locale = getLocaleOrFallback(router.locale);

  useEffect(() => {
    initAmplitude();
  }, []);

  return (
    <>
      {/* @ts-ignore */}
      <IntlProvider locale={locale} messages={messages[locale]}>
        <NavDecorator>
          <Component {...pageProps} />
        </NavDecorator>
      </IntlProvider>
    </>
  );
}

export default MyApp;
