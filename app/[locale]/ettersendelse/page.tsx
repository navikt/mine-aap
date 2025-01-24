import { EttersendelseInnsending } from 'components/ettersendelseinnsending/EttersendelseInnsending';
import { hentSøknader } from 'lib/services/innsendingService';
import { notFound } from 'next/navigation';
import styles from '../[uuid]/ettersendelse/page.module.css';
import { BodyShort, Heading, Label, ReadMore } from '@navikt/ds-react';
import { Section } from 'components/Section/Section';
import { LucaGuidePanel, ScanningGuide } from '@navikt/aap-felles-react';
import { ArrowLeftIcon } from '@navikt/aksel-icons';
import { PageHeader } from 'components/PageHeader';
import { getTranslations } from 'next-intl/server';
import { formatFullDate } from 'lib/utils/date';
import { Link, redirect } from 'i18n/routing';
import { FileUploadUtenSøknad } from 'components/fileupload/FileUploadUtenSøknad';

interface PageParams {
  locale: string;
}

const Page = async ({ params }: Readonly<{ params: Promise<PageParams> }>) => {
  const { locale } = await params;
  const t = await getTranslations('');

  const søknader = await hentSøknader();

  if (søknader?.length > 0) {
    const søknadFraInnsending = søknader[0] ?? null;

    if (søknadFraInnsending) {
      return redirect({ href: `/${søknadFraInnsending.innsendingsId}/ettersendelse`, locale });
    }
  }

  return (
    <>
      <PageHeader>{t('ettersendelse.appTittelMedSkille')}</PageHeader>

      <main className={styles.main}>
        <Section>
          <Heading level="2" size="large" spacing>
            {t('ettersendelse.heading')}
          </Heading>

          <LucaGuidePanel>
            <BodyShort spacing>{t('ettersendelse.guide')}</BodyShort>
            <BodyShort spacing>
              {t.rich('ettersendelse.guide2', {
                a: (chunks) => (
                  <Link
                    target="_blank"
                    href={
                      'https://www.nav.no/soknader/nb/person/arbeid/arbeidsavklaringspenger/NAV%2011-13.05/ettersendelse'
                    }
                  >
                    {chunks}
                  </Link>
                ),
              })}
            </BodyShort>
          </LucaGuidePanel>

          <div>
            <Label>{t('ettersendelse.annet.label')}</Label>
            <BodyShort className={styles.annetTekst}>{t('ettersendelse.annet.tekst')}</BodyShort>
          </div>

          <div>
            <BodyShort>{t('ettersendelse.slikTarDuBildeBeskrivelse')}</BodyShort>
            <ReadMore header={t('ettersendelse.slikTarDuBilde')}>
              <ScanningGuide locale={locale} />
            </ReadMore>
          </div>
        </Section>

        <FileUploadUtenSøknad />

        <Section>
          <div>
            <Link href="/">
              <ArrowLeftIcon />
              {t('tilbakeTilMineAAPKnapp')}
            </Link>
          </div>
        </Section>
      </main>
    </>
  );
};

export default Page;
