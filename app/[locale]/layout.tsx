import '@navikt/ds-css';
import '@navikt/aap-felles-css';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { fetchDecoratorReact } from '@navikt/nav-dekoratoren-moduler/ssr';
import { getEnvironment } from 'lib/utils/environments';
import Script from 'next/script';
import { routing } from 'i18n/routing';
import { NavDecorator } from 'components/NavDecorator/NavDecorator';

export async function generateMetadata() {
  const t = await getTranslations();

  return {
    title: `${t('appTittelMedSkille')} - nav.no`,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const Decorator = await fetchDecoratorReact({ env: getEnvironment() });

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <Decorator.HeadAssets />
      </head>
      <body>
        <Decorator.Header />
        <NextIntlClientProvider messages={messages}>
          <NavDecorator>{children}</NavDecorator>
        </NextIntlClientProvider>
        <Decorator.Footer />
        <Decorator.Scripts loader={Script} />
      </body>
    </html>
  );
}
