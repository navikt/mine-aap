import { BodyShort, Button, Heading, Label, Link, Panel } from '@navikt/ds-react';
import type { GetServerSidePropsResult, NextPageContext } from 'next';
import NextLink from 'next/link';
import { useMemo } from 'react';
import { beskyttetSide, getAccessToken } from '@navikt/aap-felles-innbygger-utils';
import { Layout } from 'components/Layout/Layout';
import { Section } from 'components/Section/Section';
import { SoknadPanel } from 'components/SoknadPanel/SoknadPanel';
import { Dokument, Søknad } from 'lib/types/types';
import { getDocuments } from 'pages/api/dokumenter';
import { getSøknader } from 'pages/api/soknader/soknader';
import { useRouter } from 'next/router';
import { Dokumentoversikt } from 'components/Dokumentoversikt/Dokumentoversikt';
import metrics from 'lib/metrics';
import { HvaSkjerPanel } from 'components/HvaSkjerPanel/HvaSkjerPanel';
import { LucaGuidePanel } from '@navikt/aap-felles-innbygger-react';
import Head from 'next/head';
import { FormattedMessage } from 'react-intl';

interface PageProps {
  søknader: Søknad[];
  dokumenter: Dokument[];
}

const Index = ({ søknader, dokumenter }: PageProps) => {
  const router = useRouter();

  const sisteSøknad = useMemo(() => {
    return søknader[0];
  }, [søknader]);

  return (
    <Layout>
      <Head>
        <title>
          {`${(
            <FormattedMessage
              id="appTittel"
              values={{
                shy: '',
              }}
            />
          )} - nav.no`}
        </title>
      </Head>
      <Section>
        <LucaGuidePanel>
          <Heading level="2" size="medium" spacing>
            <FormattedMessage id="forside.heading" />
          </Heading>
          <BodyShort spacing>
            <FormattedMessage id="forside.introListe.tittel" />
          </BodyShort>

          <ul>
            <li>
              <FormattedMessage id="forside.introListe.punkt1" />
            </li>
            <li>
              <FormattedMessage id="forside.introListe.punkt2" />
            </li>
            <li>
              <FormattedMessage id="forside.introListe.punkt3" />
            </li>
          </ul>

          <BodyShort spacing>
            <FormattedMessage id="forside.underUtvikling" />
          </BodyShort>
        </LucaGuidePanel>
      </Section>
      {sisteSøknad && (
        <Section lightBlue>
          <div>
            <Heading level="2" size="medium" spacing>
              <FormattedMessage id="sisteSøknad.heading" />
            </Heading>
            <SoknadPanel søknad={sisteSøknad} />
          </div>
          {søknader.length > 0 && (
            <div>
              <NextLink href="/soknader" passHref legacyBehavior>
                <Link>
                  <FormattedMessage id="forside.seInnsendteSøknaderLink" />
                </Link>
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
              <FormattedMessage id="forside.ettersendelse.tittel" />
            </Heading>
            <BodyShort spacing>
              <FormattedMessage id="forside.ettersendelse.tekst" />
            </BodyShort>
            <Button variant="secondary" onClick={() => router.push('/ettersendelse')}>
              <FormattedMessage id="forside.ettersendelse.knapp" />
            </Button>
          </Panel>
          <Link
            target="_blank"
            href="https://www.nav.no/saksbehandlingstider#arbeidsavklaringspenger-aap"
          >
            <FormattedMessage id="sisteSøknad.søknad.saksbehandlingstid" />
          </Link>
        </Section>
      )}

      <Section>
        <HvaSkjerPanel />

        <Panel border>
          <Heading level="2" size="medium" spacing>
            <FormattedMessage id="forside.endring.heading" />
          </Heading>

          <BodyShort spacing>
            <FormattedMessage id="forside.endring.tekst" />
          </BodyShort>
          <Button
            variant="secondary"
            onClick={() =>
              (window.location.href = 'https://innboks.nav.no/s/skriv-til-oss?category=Arbeid')
            }
          >
            <FormattedMessage id="forside.endring.knapp" />
          </Button>
        </Panel>

        {sisteSøknad && <Dokumentoversikt dokumenter={dokumenter} />}
      </Section>
    </Layout>
  );
};

export const getServerSideProps = beskyttetSide(
  async (ctx: NextPageContext): Promise<GetServerSidePropsResult<{}>> => {
    const stopTimer = metrics.getServersidePropsDurationHistogram.startTimer({ path: '/' });
    const bearerToken = getAccessToken(ctx);
    const params = { page: '0', size: '1', sort: 'created,desc' };
    const søknader = await getSøknader(params, bearerToken);
    const dokumenter = await getDocuments(bearerToken);

    stopTimer();
    return {
      props: { søknader, dokumenter },
    };
  }
);

export default Index;
