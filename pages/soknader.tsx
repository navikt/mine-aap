import { Button, Heading, Link } from '@navikt/ds-react';
import { GetServerSidePropsResult, NextPageContext } from 'next';
import { beskyttetSide, getAccessToken, logger } from '@navikt/aap-felles-utils';
import { VerticalFlexContainer } from 'components/FlexContainer/VerticalFlexContainer';
import { Layout } from 'components/Layout/Layout';
import { Section } from 'components/Section/Section';
import { Søknad } from 'lib/types/types';
import { getSøknader } from 'pages/api/soknader/soknader';
import { SoknadPanel } from 'components/SoknadPanel/SoknadPanel';
import { ArrowLeftIcon } from '@navikt/aksel-icons';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import metrics from 'lib/metrics';
import Head from 'next/head';
import { useIntl } from 'react-intl';

interface PageProps {
  søknader: Søknad[];
}

const Søknader = ({ søknader }: PageProps) => {
  const router = useRouter();
  const { formatMessage } = useIntl();

  return (
    <Layout>
      <Head>
        <title>
          {`${formatMessage(
            { id: 'appTittel' },
            {
              shy: '',
            }
          )} - nav.no`}
        </title>
      </Head>
      <Section>
        <NextLink href="/" passHref legacyBehavior>
          <Link>
            <ArrowLeftIcon />
            {formatMessage({ id: 'tilbakeTilMineAAPKnapp' })}
          </Link>
        </NextLink>
        <div>
          <Heading level="2" size="medium" spacing>
            {formatMessage({ id: 'dineSøknader.heading' })}
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
          <Button icon={<ArrowLeftIcon />} variant="tertiary" onClick={() => router.push('/')}>
            {formatMessage({ id: 'tilbakeTilMineAAPKnapp' })}
          </Button>
        </div>
      </Section>
    </Layout>
  );
};

export const getServerSideProps = beskyttetSide(async (ctx: NextPageContext): Promise<GetServerSidePropsResult<{}>> => {
  const stopTimer = metrics.getServersidePropsDurationHistogram.startTimer({ path: '/soknader' });
  const bearerToken = getAccessToken(ctx);
  const params = { page: '0', size: '1', sort: 'created,desc' };

  const [søknader] = await Promise.all([getSøknader(params, bearerToken)]);

  logger.info(`søknader: ${JSON.stringify(søknader)}`);

  stopTimer();
  return {
    props: { søknader },
  };
});

export default Søknader;
