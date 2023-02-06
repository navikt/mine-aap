import { Button, Heading, Link } from '@navikt/ds-react';
import { NextPageContext, GetServerSidePropsResult } from 'next';
import { beskyttetSide, getAccessToken } from '@navikt/aap-felles-innbygger-utils';
import { VerticalFlexContainer } from 'components/FlexContainer/VerticalFlexContainer';
import { Layout } from 'components/Layout/Layout';
import { Section } from 'components/Section/Section';
import { Søknad } from 'lib/types/types';
import { logger } from '@navikt/aap-felles-innbygger-utils';
import { getSøknader } from 'pages/api/soknader/soknader';
import { SoknadPanel } from 'components/SoknadPanel/SoknadPanel';
import { Left } from '@navikt/ds-icons';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import metrics from 'lib/metrics';
import Head from 'next/head';
import { FormattedMessage } from 'react-intl';

interface PageProps {
  søknader: Søknad[];
}

const Søknader = ({ søknader }: PageProps) => {
  const router = useRouter();

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
        <NextLink href="/" passHref legacyBehavior>
          <Link>
            <Left />
            <FormattedMessage id="tilbakeTilMineAAPKnapp" />
          </Link>
        </NextLink>
        <div>
          <Heading level="2" size="medium" spacing>
            <FormattedMessage id="dineSøknader.heading" />
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
            <FormattedMessage id="tilbakeTilMineAAPKnapp" />
          </Button>
        </div>
      </Section>
    </Layout>
  );
};

export const getServerSideProps = beskyttetSide(
  async (ctx: NextPageContext): Promise<GetServerSidePropsResult<{}>> => {
    const stopTimer = metrics.getServersidePropsDurationHistogram.startTimer({ path: '/soknader' });
    const bearerToken = getAccessToken(ctx);
    const params = { page: '0', size: '200', sort: 'created,desc' };
    const søknader = await getSøknader(params, bearerToken);

    logger.info(`søknader: ${JSON.stringify(søknader)}`);

    stopTimer();
    return {
      props: { søknader },
    };
  }
);

export default Søknader;
