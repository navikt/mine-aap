import { getDocuments } from './api/dokumenter';
import { getSøknader } from './api/soknader/soknader';
import { beskyttetSide, getAccessToken } from '@navikt/aap-felles-utils';
import { BodyShort, Button, Heading } from '@navikt/ds-react';
import { Card } from 'components/Card/Card';
import { DokumentoversiktContainer } from 'components/DokumentoversiktNy/DokumentoversiktContainer';
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
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

const Index = ({ søknader, dokumenter }: { søknader: Søknad[]; dokumenter: Dokument[] }) => {
  const { formatElement } = useFeatureToggleIntl();

  const router = useRouter();

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
      {!sisteSøknad && (
        <>
          <DokumentoversiktContainer dokumenter={dokumenter} />
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
            onClick={() =>
              (window.location.href = 'https://innboks.nav.no/s/skriv-til-oss?category=Arbeid')
            }
          >
            <FormattedMessage id="forside.endretSituasjon.knapp" />
          </Button>
        </Card>
      </PageComponentFlexContainer>
      {sisteSøknad && <DokumentoversiktContainer dokumenter={dokumenter} />}
    </PageContainer>
  );
};

export const getServerSideProps = beskyttetSide(
  async (ctx: NextPageContext): Promise<GetServerSidePropsResult<{}>> => {
    const stopTimer = metrics.getServersidePropsDurationHistogram.startTimer({ path: '/' });
    const bearerToken = getAccessToken(ctx);
    const params = { page: '0', size: '1', sort: 'created,desc' };

    const [søknader, dokumenter] = await Promise.all([
      getSøknader(params, bearerToken),
      getDocuments(bearerToken),
    ]);

    stopTimer();

    return {
      props: { søknader, dokumenter },
    };
  }
);

export default Index;
