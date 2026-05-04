import { ArrowLeftIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Heading, HStack, Label, VStack } from '@navikt/ds-react';
import { FileUploadUtenSøknad } from 'components/fileupload/FileUploadUtenSøknad';
import LucaGuidePanel from 'components/LucaGuidePanel';
import { PageHeader } from 'components/PageHeader';
import ScanningGuide from 'components/ScanningGuide';
import { Section } from 'components/Section/Section';
import { Link, redirect } from 'i18n/routing';
import { hentSøknader } from 'lib/services/innsendingService';
import { isError } from 'lib/utils/api-fetch';
import { getTranslations } from 'next-intl/server';

interface PageParams {
  locale: string;
}

const Page = async ({ params }: Readonly<{ params: Promise<PageParams> }>) => {
  const { locale } = await params;
  const t = await getTranslations('');

  const søknader = await hentSøknader();
  if (isError(søknader)) {
    return (
      <VStack marginBlock="0 12">
        <Section>
          <Alert variant={'error'}>{t('dineSøknader.noeGikkGalt')}</Alert>
        </Section>
      </VStack>
    );
  }

  if (søknader.data.length > 0) {
    const søknadFraInnsending = søknader.data[0] ?? null;

    if (søknadFraInnsending) {
      return redirect({
        href: `/${søknadFraInnsending.innsendingsId}/ettersendelse`,
        locale,
      });
    }
  }

  return (
    <>
      <PageHeader>{t('ettersendelse.appTittelMedSkille')}</PageHeader>

      <VStack marginBlock="0 12">
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
            <BodyShort>{t('ettersendelse.annet.tekst')}</BodyShort>
          </div>

          <div>
            <ScanningGuide />
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
      </VStack>
    </>
  );
};

export default Page;
