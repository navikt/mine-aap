import { getSøknaderInnsending } from './api/soknader/soknader';
import { beskyttetSide, logError, logInfo } from '@navikt/aap-felles-utils';
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
import { getEttersendelserForSøknad } from 'pages/api/soknader/[uuid]/ettersendelser';
import { getDokumentJson } from 'pages/api/dokumentjson';

const Index = ({
  sisteSøknadInnsending,
  ettersendelse,
}: {
  sisteSøknadInnsending: InnsendingSøknad;
  ettersendelse?: MineAapSoknadMedEttersendinger;
}) => {
  const { formatMessage } = useIntl();

  const router = useRouter();

  useEffect(() => {
    if (sisteSøknadInnsending != undefined && sisteSøknadInnsending.mottattDato != undefined) {
      const erEldreEnn15Uker = isBefore(new Date(sisteSøknadInnsending.mottattDato), sub(new Date(), { weeks: 15 }));
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
  }, [sisteSøknadInnsending]);

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
      {sisteSøknadInnsending && (
        <PageComponentFlexContainer subtleBackground>
          <Heading level="2" size="medium" spacing>
            <FormattedMessage id="minSisteSøknad.heading" />
          </Heading>
          <Card>
            <SoknadInnsending søknad={sisteSøknadInnsending} ettersendelse={ettersendelse} />
          </Card>
        </PageComponentFlexContainer>
      )}
      {!sisteSøknadInnsending && (
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
      {sisteSøknadInnsending && <DokumentoversiktContainer />}
    </PageContainer>
  );
};

export const getServerSideProps = beskyttetSide(async (ctx: NextPageContext): Promise<GetServerSidePropsResult<{}>> => {
  const stopTimer = metrics.getServersidePropsDurationHistogram.startTimer({ path: '/' });

  const innsendingSøknader = await getSøknaderInnsending(ctx.req);

  let sisteSøknadInnsending;
  let ettersendelse: MineAapSoknadMedEttersendinger | null = null;
  try {
    sisteSøknadInnsending = innsendingSøknader[0];

    if (sisteSøknadInnsending) {
      logInfo('Bruker har søknad sendt inn via innsending');

      ettersendelse = await getEttersendelserForSøknad(sisteSøknadInnsending.innsendingsId, ctx.req);
      logInfo(`getEttersendelserForSøknad: ${JSON.stringify(ettersendelse)}`);
      if (sisteSøknadInnsending.journalpostId && process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev') {
        const søknadJson = await getDokumentJson(sisteSøknadInnsending.journalpostId, ctx.req);
        logInfo(`oppslag/dokumenter/${sisteSøknadInnsending.journalpostId}: ${JSON.stringify(søknadJson)}`);
      }
    }
  } catch (error) {
    logError('Feil ved henting av søknader sendt inn via innsending', error);
  }

  stopTimer();

  return {
    props: { sisteSøknadInnsending, ettersendelse: ettersendelse },
  };
});

export default Index;
