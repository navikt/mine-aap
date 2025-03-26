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
import { Alert } from '@navikt/ds-react';

import styles from './layout.module.css';

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
          <NavDecorator>
            <div className={styles.banner}>
              <div className={styles.alertWrapper}>
                <Alert variant="info" className={styles.alert}>
                  Vi har gjort endringer i meldekortet og fjernet spørsmål 5, hvor vi spør om du fortsatt ønsker å være
                  registrert hos Nav de neste 14 dagene. Skal du skal være registrert som arbeidssøker hos Nav mens du
                  mottar AAP må du i tillegg til å sende inn meldekort, bekrefte din status som arbeidssøker i en egen
                  melding på Minside.
                </Alert>
              </div>
            </div>
            {children}
          </NavDecorator>
        </NextIntlClientProvider>
        <Decorator.Footer />
        <Decorator.Scripts loader={Script} />
      </body>
    </html>
  );
}
