import { beskyttetSide } from '@navikt/aap-felles-innbygger-utils';
import { Heading, Ingress } from '@navikt/ds-react';
import { PageComponentFlexContainer } from 'components/PageComponentFlexContainer/PageComponentFlexContainer';
import { PageContainer } from 'components/PageContainer/PageContainer';
import { GetServerSidePropsResult, NextPageContext } from 'next';

const Index = () => {
  return (
    <PageContainer>
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
