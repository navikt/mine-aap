import { beskyttetSide, logInfo } from '@navikt/aap-felles-utils';
import { BodyShort, Button, Heading } from '@navikt/ds-react';
import { Card } from 'components/Card/Card';
import { DokumentoversiktContainer } from 'components/DokumentoversiktNy/DokumentoversiktContainer';
import { ForsideIngress } from 'components/Forside/Ingress/ForsideIngress';
import { NyttigÅVite } from 'components/NyttigÅVite/NyttigÅVite';
import { PageComponentFlexContainer } from 'components/PageComponentFlexContainer/PageComponentFlexContainer';
import { PageContainer } from 'components/PageContainer/PageContainer';
import { isBefore, sub } from 'date-fns';
import metrics from 'lib/metrics';
import { InnsendingSøknad, MineAapSoknadMedEttersendinger } from 'lib/types/types';
import { GetServerSidePropsResult, NextPageContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { SoknadInnsending } from 'components/Soknad/SoknadInnsending';
import { getSøknaderMedEttersendinger } from 'pages/api/soknader/soknadermedettersendinger';

const Index = ({ søknaderMedEttersendinger }: { søknaderMedEttersendinger: MineAapSoknadMedEttersendinger[] }) => {
  const { formatMessage } = useIntl();

  const router = useRouter();

  const sisteSøknadInnsendingNy: InnsendingSøknad | undefined = søknaderMedEttersendinger[0];
  const ettersendelser: InnsendingSøknad[] = søknaderMedEttersendinger[0]?.ettersendinger;

  useEffect(() => {
    if (sisteSøknadInnsendingNy != undefined && sisteSøknadInnsendingNy.mottattDato != undefined) {
      const erEldreEnn15Uker = isBefore(new Date(sisteSøknadInnsendingNy.mottattDato), sub(new Date(), { weeks: 15 }));
      if (erEldreEnn15Uker) {
        setTimeout(() => {
          // @ts-ignore-line
          if (typeof window.TA === 'function') {
            // @ts-ignore-line
            window?.TA('start', '03401');
          } else {
            console.log('TA ble ikke lastet inn i tide :(');
          }
        }, 1000);
      } else {
        console.log('Siste søknad er ikke eldre enn 14 uker');
      }
    }
  }, [sisteSøknadInnsendingNy]);

  return (
    <PageContainer>
      <Head>
        <title>
          {`${formatMessage(
            { id: 'appTittel' },
            {
              shy: '',
            }
          )} - nav.no`}
        </title>
      </Head>
      <PageComponentFlexContainer>
        <Heading level="1" size="large" spacing>
          <FormattedMessage id="appTittel" values={{ shy: <>&shy;</> }} />
        </Heading>
        <ForsideIngress>
          <FormattedMessage id="appIngress" />
        </ForsideIngress>
      </PageComponentFlexContainer>
      {sisteSøknadInnsendingNy && (
        <PageComponentFlexContainer subtleBackground>
          <Heading level="2" size="medium" spacing>
            <FormattedMessage id="minSisteSøknad.heading" />
          </Heading>
          <Card>
            <SoknadInnsending søknad={sisteSøknadInnsendingNy} ettersendelser={ettersendelser} />
          </Card>
        </PageComponentFlexContainer>
      )}
      {!sisteSøknadInnsendingNy && (
        <>
          <DokumentoversiktContainer />
          <PageComponentFlexContainer>
            <Heading level="2" size="medium" spacing>
              <FormattedMessage id="forside.ettersendelse.tittel" />
            </Heading>
            <Card subtleBlue>
              <BodyShort spacing>
                <FormattedMessage id="forside.ettersendelse.tekst" />
              </BodyShort>
              <Button variant="secondary" onClick={() => router.push('/ettersendelse')}>
                <FormattedMessage id="forside.ettersendelse.knapp" />
              </Button>
            </Card>
          </PageComponentFlexContainer>
        </>
      )}
      <PageComponentFlexContainer>
        <NyttigÅVite />
      </PageComponentFlexContainer>
      <PageComponentFlexContainer>
        <Heading level="2" size="medium" spacing>
          <FormattedMessage id="forside.endretSituasjon.heading" />
        </Heading>
        <Card subtleBlue>
          <BodyShort spacing>
            <FormattedMessage id="forside.endretSituasjon.tekst" />
          </BodyShort>
          <Button
            variant="secondary"
            onClick={() => (window.location.href = 'https://innboks.nav.no/s/skriv-til-oss?category=Arbeid')}
          >
            <FormattedMessage id="forside.endretSituasjon.knapp" />
          </Button>
        </Card>
      </PageComponentFlexContainer>
      {sisteSøknadInnsendingNy && <DokumentoversiktContainer />}
    </PageContainer>
  );
};

export const getServerSideProps = beskyttetSide(async (ctx: NextPageContext): Promise<GetServerSidePropsResult<{}>> => {
  const stopTimer = metrics.getServersidePropsDurationHistogram.startTimer({ path: '/' });

  const søknaderMedEttersendinger = await getSøknaderMedEttersendinger(ctx.req);

  stopTimer();

  if (søknaderMedEttersendinger?.length > 0) {
    return {
      props: { søknaderMedEttersendinger: søknaderMedEttersendinger },
    };
  }

  logInfo('Fant ingen søknader med ettersendinger');
  return {
    props: { søknaderMedEttersendinger: [] },
  };
});

export default Index;
