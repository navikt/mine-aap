import { BodyShort, Button, Heading, Label, Link, Panel } from '@navikt/ds-react';
import type { GetServerSidePropsResult, NextPageContext } from 'next';
import NextLink from 'next/link';
import { useMemo } from 'react';
import { getAccessToken } from 'lib/auth/accessToken';
import { beskyttetSide } from 'lib/auth/beskyttetSide';
import { Layout } from 'components/Layout/Layout';
import { Section } from 'components/Section/Section';
import { SoknadPanel } from 'components/SoknadPanel/SoknadPanel';
import { useFeatureToggleIntl } from 'lib/hooks/useFeatureToggleIntl';
import { Dokument, Søknad } from 'lib/types/types';
import { getDocuments } from 'pages/api/dokumenter';
import { getSøknader } from 'pages/api/soknader/soknader';
import { logger } from '@navikt/aap-felles-innbygger-utils';
import { useRouter } from 'next/router';
import { Dokumentoversikt } from 'components/Dokumentoversikt/Dokumentoversikt';
import metrics from 'lib/metrics';
import { HvaSkjerPanel } from 'components/HvaSkjerPanel/HvaSkjerPanel';
import { LucaGuidePanel } from '@navikt/aap-felles-innbygger-react';

interface PageProps {
  søknader: Søknad[];
  dokumenter: Dokument[];
}

const Index = ({ søknader, dokumenter }: PageProps) => {
  const { formatMessage } = useFeatureToggleIntl();

  const router = useRouter();

  const sisteSøknad = useMemo(() => {
    return søknader[0];
  }, [søknader]);

  return (
    <Layout>
      <Section>
        <LucaGuidePanel>
          <Heading level="2" size="medium" spacing>
            Velkommen til Mine AAP!
          </Heading>
          <BodyShort spacing>På denne siden finner du:</BodyShort>

          <ul>
            <li>Mulighet for å ettersende dokumenter til søknad og sak</li>
            <li>
              Mulighet for å gi beskjed om endringer og gi oss opplysninger du mener er viktig for
              saken din
            </li>
            <li>
              En oversikt over alle dine dokumenter som er knyttet til arbeidsavklaringspenger
            </li>
          </ul>

          <BodyShort spacing>
            Denne siden er under utvikling, og vil bli utvidet med flere funksjoner etter hvert.
          </BodyShort>
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
              <NextLink href="/soknader" passHref>
                <Link>Se alle dine innsendte søknader</Link>
              </NextLink>
            </div>
          )}
        </Section>
      )}

      {!sisteSøknad && (
        <Section>
          <Dokumentoversikt dokumenter={dokumenter} />
          <Panel border>
            <Label spacing>Ettersending</Label>
            <BodyShort spacing>
              Er det noe du vil ettersende til oss om din AAP sak Da kan du gjøre det her.
            </BodyShort>
            <Button variant="secondary" onClick={() => router.push('/ettersendelse')}>
              Ettersend dokumenter
            </Button>
          </Panel>
        </Section>
      )}

      <Section>
        <HvaSkjerPanel />

        <Panel border>
          <Heading level="2" size="medium" spacing>
            Vil du melde fra om en endring i din situasjon?
          </Heading>

          <BodyShort spacing>
            Her kan du gi beskjed om endringer og gi oss opplysninger du mener er viktig for saken
            din. Hvis du har en aktivitetsplan, benytter du denne.
          </BodyShort>
          <Button
            variant="secondary"
            onClick={() =>
              (window.location.href = 'https://innboks.nav.no/s/skriv-til-oss?category=Arbeid')
            }
          >
            Meld endring
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

    logger.info(`søknader: ${JSON.stringify(søknader)}`);

    stopTimer();
    return {
      props: { søknader, dokumenter },
    };
  }
);

export default Index;
