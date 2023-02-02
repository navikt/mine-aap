import { beskyttetSide } from '@navikt/aap-felles-innbygger-utils';
import { BodyShort, Button, Heading, Ingress } from '@navikt/ds-react';
import { Card } from 'components/Card/Card';
import { PageComponentFlexContainer } from 'components/PageComponentFlexContainer/PageComponentFlexContainer';
import { PageContainer } from 'components/PageContainer/PageContainer';
import { Soknad } from 'components/Soknad/Soknad';
import { useFeatureToggleIntl } from 'lib/hooks/useFeatureToggleIntl';
import { GetServerSidePropsResult, NextPageContext } from 'next';
import Head from 'next/head';

const Index = () => {
  const { formatElement } = useFeatureToggleIntl();
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
      <PageComponentFlexContainer subtleBackground>
        <Heading level="2" size="medium" spacing>
          Min siste søknad
        </Heading>
        <Card>
          <Soknad />
        </Card>
      </PageComponentFlexContainer>
      <PageComponentFlexContainer>
        <Heading level="2" size="medium" spacing>
          Nyttig å vite
        </Heading>
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

    return {
      props: {},
    };
  }
);

export default Index;
