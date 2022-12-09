import { Button, Heading, Link } from '@navikt/ds-react';
import { NextPageContext, GetServerSidePropsResult } from 'next';
import { getAccessToken } from 'lib/auth/accessToken';
import { beskyttetSide } from 'lib/auth/beskyttetSide';
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
import { useFeatureToggleIntl } from 'lib/hooks/useFeatureToggleIntl';
import Head from 'next/head';

interface PageProps {
  søknader: Søknad[];
}

const Søknader = ({ søknader }: PageProps) => {
  const router = useRouter();
  const { formatMessage, formatElement } = useFeatureToggleIntl();

  return (
    <Layout>
      <Head>
        <title>
          {`${formatElement('appTittel', {
            shy: '',
          })} - nav.no`}
        </title>
      </Head>
      <Section>
        <NextLink href="/" passHref>
          <Link>
            <Left />
            {formatMessage('tilbakeTilMineAAPKnapp')}
          </Link>
        </NextLink>
        <div>
          <Heading level="2" size="medium" spacing>
            {formatMessage('dineSøknader.heading')}
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
            {formatMessage('tilbakeTilMineAAPKnapp')}
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
