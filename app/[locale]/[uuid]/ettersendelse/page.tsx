import { EttersendelseInnsending } from 'components/ettersendelseinnsending/EttersendelseInnsending';
import { hentSøknader } from 'lib/services/innsendingService';
import { notFound } from 'next/navigation';
import { BodyShort, Heading, Label, VStack } from '@navikt/ds-react';
import { Section } from 'components/Section/Section';
import { ArrowLeftIcon } from '@navikt/aksel-icons';
import { PageHeader } from 'components/PageHeader';
import { getTranslations } from 'next-intl/server';
import { formatFullDate } from 'lib/utils/date';
import { Link } from 'i18n/routing';
import LucaGuidePanel from 'components/LucaGuidePanel';
import ScanningGuide from 'components/ScanningGuide';

interface PageParams {
  uuid: string;
}

const Page = async ({ params }: Readonly<{ params: Promise<PageParams> }>) => {
  const { uuid } = await params;
  const t = await getTranslations('');

  const søknader = await hentSøknader();

  if (søknader?.length > 0) {
    const søknadFraInnsending = søknader.find((søknad) => søknad.innsendingsId === uuid) ?? null;

    if (!søknadFraInnsending) {
      return notFound();
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
            <Label as="p">
              {t('ettersendelse.gjeldendeSøknad', { dateTime: formatFullDate(søknadFraInnsending.mottattDato) })}
            </Label>

            <div>
              <ScanningGuide />
            </div>
            <EttersendelseInnsending søknad={søknadFraInnsending} />
          </Section>

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
  }
  return notFound();
};

export default Page;
