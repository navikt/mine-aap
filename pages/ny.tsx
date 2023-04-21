import { getDocuments } from './api/dokumenter';
import { getSøknader } from './api/soknader/soknader';
import { beskyttetSide, getAccessToken } from '@navikt/aap-felles-innbygger-utils';
import { BodyShort, Button, Heading, ReadMore } from '@navikt/ds-react';
import { Card } from 'components/Card/Card';
import { Dokumentoversikt } from 'components/DokumentoversiktNy/Dokumentoversikt';
import { ForsideIngress } from 'components/Forside/Ingress/ForsideIngress';
import { NyttigÅVite } from 'components/NyttigÅVite/NyttigÅVite';
import { PageComponentFlexContainer } from 'components/PageComponentFlexContainer/PageComponentFlexContainer';
import { PageContainer } from 'components/PageContainer/PageContainer';
import { Soknad } from 'components/Soknad/Soknad';
import { useFeatureToggleIntl } from 'lib/hooks/useFeatureToggleIntl';
import metrics from 'lib/metrics';
import { Dokument, Søknad } from 'lib/types/types';
import { GetServerSidePropsResult, NextPageContext } from 'next';
import Head from 'next/head';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

const Index = ({ søknader, dokumenter }: { søknader: Søknad[]; dokumenter: Dokument[] }) => {
  const { formatElement, formatMessage } = useFeatureToggleIntl();

  const sisteSøknad = useMemo(() => {
    return søknader[0];
  }, [søknader]);

  return (
    <PageContainer>
      <Head>
        <title>
          {`${formatElement('appTittel', {
            shy: '',
          })} - nav.no`}
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
      {sisteSøknad && (
        <PageComponentFlexContainer subtleBackground>
          <Heading level="2" size="medium" spacing>
            <FormattedMessage id="minSisteSøknad.heading" />
          </Heading>
          <Card>
            <Soknad søknad={sisteSøknad} />
          </Card>
        </PageComponentFlexContainer>
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
            onClick={() =>
              (window.location.href = 'https://innboks.nav.no/s/skriv-til-oss?category=Arbeid')
            }
          >
            <FormattedMessage id="forside.endretSituasjon.knapp" />
          </Button>
        </Card>
      </PageComponentFlexContainer>
      <PageComponentFlexContainer subtleBackground>
        <div style={{ maxWidth: '600px' }}>
          <Heading level="2" size="medium" spacing>
            <FormattedMessage id="dokumentoversikt.tittel" />
          </Heading>
          <BodyShort spacing>
            <FormattedMessage id="dokumentoversikt.tekst" />
          </BodyShort>
          <ReadMore header={formatMessage('dokumentoversikt.manglendeDokument.header')}>
            <BodyShort spacing>
              <FormattedMessage id="dokumentoversikt.manglendeDokument.tekst" />
            </BodyShort>
          </ReadMore>

          <Dokumentoversikt dokumenter={dokumenter} />
        </div>
      </PageComponentFlexContainer>
    </PageContainer>
  );
};

const enabledEnvironments = ['localhost', 'dev', 'labs'];

export const getServerSideProps = beskyttetSide(
  async (ctx: NextPageContext): Promise<GetServerSidePropsResult<{}>> => {
    if (!enabledEnvironments.includes(process.env.NEXT_PUBLIC_ENVIRONMENT || '')) {
      return {
        notFound: true,
      };
    }

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
