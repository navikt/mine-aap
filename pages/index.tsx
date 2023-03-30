import { LucaGuidePanel } from '@navikt/aap-felles-innbygger-react';
import { beskyttetSide, getAccessToken } from '@navikt/aap-felles-innbygger-utils';
import { Alert, BodyShort, Button, Heading, Link, Panel } from '@navikt/ds-react';
import { useFeatureToggleIntl } from 'lib/hooks/useFeatureToggleIntl';
import metrics from 'lib/metrics';
import { Dokument, Søknad } from 'lib/types/types';
import type { GetServerSidePropsResult, NextPageContext } from 'next';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { getDocuments } from 'pages/api/dokumenter';
import { getSøknader } from 'pages/api/soknader/soknader';
import { useMemo } from 'react';

import { Dokumentoversikt } from 'components/Dokumentoversikt/Dokumentoversikt';
import { HvaSkjerPanel } from 'components/HvaSkjerPanel/HvaSkjerPanel';
import { Layout } from 'components/Layout/Layout';
import { Section } from 'components/Section/Section';
import { SoknadPanel } from 'components/SoknadPanel/SoknadPanel';

interface PageProps {
  søknader: Søknad[];
  dokumenter: Dokument[];
}

const Index = ({ søknader, dokumenter }: PageProps) => {
  const { formatMessage, formatElement } = useFeatureToggleIntl();

  const router = useRouter();

  const sisteSøknad = useMemo(() => {
    return søknader[0];
  }, [søknader]);

  return (
    <Layout>
      <Head>
        <title>
          {`${formatElement('appTittel', {
            shy: '',
          })} - nav.no`}
        </title>
      </Head>

      <Section>
        <Alert variant="info">
          <BodyShort spacing>
            Fra mandag 27. mars kl 9:30 til tirsdag 28. mars kl 11:00 var det problemer med nedlasting av dokumenter.
          </BodyShort>
          <BodyShort spacing>
            Vi har rettet feilen og beklager ulempene dette har medført. Hvis du har prøvd å laste ned dokumenter i
            denne perioden og opplevd feil, kan du prøve på nytt nå.
          </BodyShort>
        </Alert>
        <LucaGuidePanel>
          <Heading level="2" size="medium" spacing>
            {formatMessage('forside.heading')}
          </Heading>
          <BodyShort spacing>{formatMessage('forside.introListe.tittel')}</BodyShort>

          <ul>
            <li>{formatMessage('forside.introListe.punkt1')}</li>
            <li>{formatMessage('forside.introListe.punkt2')}</li>
            <li>{formatMessage('forside.introListe.punkt3')}</li>
          </ul>

          <BodyShort spacing>{formatMessage('forside.underUtvikling')}</BodyShort>
        </LucaGuidePanel>
      </Section>
      {sisteSøknad && (
        <Section lightBlue>
          <div>
            <Heading level="2" size="medium" spacing>
              {formatMessage('sisteSøknad.heading')}
            </Heading>
            <SoknadPanel søknad={sisteSøknad} />
          </div>
          {søknader.length > 0 && (
            <div>
              <NextLink href="/soknader" passHref legacyBehavior>
                <Link>{formatMessage('forside.seInnsendteSøknaderLink')}</Link>
              </NextLink>
            </div>
          )}
        </Section>
      )}

      {!sisteSøknad && (
        <Section>
          <Dokumentoversikt dokumenter={dokumenter} />
          <Panel border>
            <Heading level="2" size="medium" spacing>
              {formatMessage('forside.ettersendelse.tittel')}
            </Heading>
            <BodyShort spacing>{formatMessage('forside.ettersendelse.tekst')}</BodyShort>
            <Button variant="secondary" onClick={() => router.push('/ettersendelse')}>
              {formatMessage('forside.ettersendelse.knapp')}
            </Button>
          </Panel>
          <Link target="_blank" href="https://www.nav.no/saksbehandlingstider#arbeidsavklaringspenger-aap">
            {formatMessage('sisteSøknad.søknad.saksbehandlingstid')}
          </Link>
        </Section>
      )}

      <Section>
        <HvaSkjerPanel />

        <Panel border>
          <Heading level="2" size="medium" spacing>
            {formatMessage('forside.endring.heading')}
          </Heading>

          <BodyShort spacing>{formatMessage('forside.endring.tekst')}</BodyShort>
          <Button
            variant="secondary"
            onClick={() => (window.location.href = 'https://innboks.nav.no/s/skriv-til-oss?category=Arbeid')}
          >
            {formatMessage('forside.endring.knapp')}
          </Button>
        </Panel>

        {sisteSøknad && <Dokumentoversikt dokumenter={dokumenter} />}
      </Section>
    </Layout>
  );
};

export const getServerSideProps = beskyttetSide(async (ctx: NextPageContext): Promise<GetServerSidePropsResult<{}>> => {
  const stopTimer = metrics.getServersidePropsDurationHistogram.startTimer({ path: '/' });
  const bearerToken = getAccessToken(ctx);
  const params = { page: '0', size: '1', sort: 'created,desc' };
  const søknader = await getSøknader(params, bearerToken);
  const dokumenter = await getDocuments(bearerToken);

  stopTimer();
  return {
    props: { søknader, dokumenter },
  };
});

export default Index;
