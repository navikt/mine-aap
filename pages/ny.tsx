import { beskyttetSide, getAccessToken } from '@navikt/aap-felles-innbygger-utils';
import { BodyShort, Button, Heading, Ingress, LinkPanel, Select } from '@navikt/ds-react';
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
import { getDocuments } from './api/dokumenter';
import { getSøknader } from './api/soknader/soknader';

const Index = ({ søknader, dokumenter }: { søknader: Søknad[]; dokumenter: Dokument[] }) => {
  const { formatElement } = useFeatureToggleIntl();

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
          Arbeidsavklarings&shy;pengene mine
        </Heading>
        <Ingress style={{ color: 'var(--a-text-subtle)' }}>
          Se status på søknaden din, ettersend- og se tidligere innsendte dokumenter, eller gi
          beskjed om eventuelle endringer.
        </Ingress>
      </PageComponentFlexContainer>
      {sisteSøknad && (
        <PageComponentFlexContainer subtleBackground>
          <Heading level="2" size="medium" spacing>
            Min siste søknad
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
          Situasjonen min har endret seg
        </Heading>
        <Card subtleBlue>
          <BodyShort spacing>
            Her kan du gi beskjed om endringer og gi oss opplysninger du mener er viktig for saken
            din. Hvis du har en aktivitetsplan, benytter du denne.
          </BodyShort>
          <Button variant="secondary">Meld endring</Button>
        </Card>
      </PageComponentFlexContainer>
      <PageComponentFlexContainer>
        <Heading level="2" size="medium" spacing>
          Dokumentoversikt
        </Heading>
        <BodyShort spacing>
          Her finner du alle søknader, vedlegg, vedtak, brev, samtalerefater og meldinger om AAP og
          oppfølging.
        </BodyShort>

        <Dokumentoversikt dokumenter={dokumenter} />
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
