import { getDocuments } from './api/dokumenter';
import { getSøknader } from './api/soknader/soknader';
import { beskyttetSide, getAccessToken } from '@navikt/aap-felles-innbygger-utils';
import { BodyShort, Button, Heading, Ingress } from '@navikt/ds-react';
import { Card } from 'components/Card/Card';
import { Dokumentoversikt } from 'components/DokumentoversiktNy/Dokumentoversikt';
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
        <Ingress style={{ color: 'var(--a-text-subtle)' }}>
          <FormattedMessage id="appIngress" />
        </Ingress>
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
            Dokumentoversikt
          </Heading>
          <BodyShort spacing>
            Her finner du dine søknader, vedlegg, vedtak, brev, samtalerefater og meldinger om AAP
            og oppfølging.
          </BodyShort>
          <BodyShort spacing>{formatMessage('dokumentoversikt.manglendeDokument.tekst')}</BodyShort>

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
