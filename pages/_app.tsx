import '@navikt/ds-css';
import '@navikt/aap-felles-css';
import 'styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { IntlProvider } from 'react-intl';
import { useRouter } from 'next/router';
import { SUPPORTED_LOCALE } from 'lib/translations/locales';
import { NavDecorator } from 'components/NavDecorator/NavDecorator';
import { initializeFaro } from '@grafana/faro-web-sdk';
import { messages } from 'lib/utils/messages';
import { DecoratorLocale } from '@navikt/nav-dekoratoren-moduler';

const getLocaleOrFallback = (locale?: DecoratorLocale) => {
  if (locale && SUPPORTED_LOCALE.includes(locale)) {
    return locale;
  }
  return 'nb';
};

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const locale = getLocaleOrFallback(router.locale as DecoratorLocale);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_FARO_URL) {
      initializeFaro({
        url: process.env.NEXT_PUBLIC_FARO_URL,
        app: {
          name: 'aap-mine-aap',
          version: process.env.NEXT_PUBLIC_ENVIRONMENT ?? '',
        },
      });
    }
  }, []);

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <NavDecorator>
        <Component {...pageProps} />
      </NavDecorator>
    </IntlProvider>
  );
}

export default MyApp;
