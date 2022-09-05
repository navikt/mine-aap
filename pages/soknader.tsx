import { Heading } from '@navikt/ds-react';
import { NextPageContext, GetServerSidePropsResult } from 'next';
import { getAccessToken } from 'lib/auth/accessToken';
import { beskyttetSide } from 'lib/auth/beskyttetSide';
import { VerticalFlexContainer } from 'components/FlexContainer/VerticalFlexContainer';
import { Layout } from 'components/Layout/Layout';
import { Section } from 'components/Section/Section';
import { Søknad } from '../lib/types/types';
import logger from 'lib/utils/logger';
import { getSøknader } from 'pages/api/soknader/soknader';
import { SoknadPanel } from 'components/SoknadPanel/SoknadPanel';

interface PageProps {
  søknader: Søknad[];
}

const Søknader = ({ søknader }: PageProps) => {
  return (
    <Layout>
      <Section lightBlue>
        <div>
          <Heading level="2" size="medium" spacing>
            Dine innsendte søknader
          </Heading>
          <VerticalFlexContainer>
            {søknader.map((søknad) => (
              <SoknadPanel key={søknad.søknadId} søknad={søknad} />
            ))}
          </VerticalFlexContainer>
        </div>
      </Section>
    </Layout>
  );
};

export const getServerSideProps = beskyttetSide(
  async (ctx: NextPageContext): Promise<GetServerSidePropsResult<{}>> => {
    const bearerToken = getAccessToken(ctx);
    const søknader = await getSøknader(bearerToken);

    logger.info(`søknader: ${JSON.stringify(søknader)}`);

    return {
      props: { søknader },
    };
  }
);

export default Søknader;
