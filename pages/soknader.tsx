import { Button, Heading, Link } from '@navikt/ds-react';
import { NextPageContext, GetServerSidePropsResult } from 'next';
import { getAccessToken } from 'lib/auth/accessToken';
import { beskyttetSide } from 'lib/auth/beskyttetSide';
import { VerticalFlexContainer } from 'components/FlexContainer/VerticalFlexContainer';
import { Layout } from 'components/Layout/Layout';
import { Section } from 'components/Section/Section';
import { Søknad } from '../lib/types/types';
import { logger } from '@navikt/aap-felles-innbygger-utils';
import { getSøknader } from 'pages/api/soknader/soknader';
import { SoknadPanel } from 'components/SoknadPanel/SoknadPanel';
import { Left } from '@navikt/ds-icons';
import { useRouter } from 'next/router';
import NextLink from 'next/link';

interface PageProps {
  søknader: Søknad[];
}

const Søknader = ({ søknader }: PageProps) => {
  const router = useRouter();

  return (
    <Layout>
      <Section>
        <NextLink href="/" passHref>
          <Link>
            <Left />
            Tilbake til Mine Arbeidsavklaringspenger
          </Link>
        </NextLink>
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
      <Section>
        <div>
          <Button icon={<Left />} variant="tertiary" onClick={() => router.push('/')}>
            Tilbake til Mine Arbeidsavklaringspenger
          </Button>
        </div>
      </Section>
    </Layout>
  );
};

export const getServerSideProps = beskyttetSide(
  async (ctx: NextPageContext): Promise<GetServerSidePropsResult<{}>> => {
    const bearerToken = getAccessToken(ctx);
    const params = { page: '0', size: '200', sort: 'created,desc' };
    const søknader = await getSøknader(params, bearerToken);

    logger.info(`søknader: ${JSON.stringify(søknader)}`);

    return {
      props: { søknader },
    };
  }
);

export default Søknader;
