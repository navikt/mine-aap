import { Button, Heading, Link } from '@navikt/ds-react';
import { GetServerSidePropsResult, NextPageContext } from 'next';
import { beskyttetSide, logInfo } from '@navikt/aap-felles-utils';
import { VerticalFlexContainer } from 'components/FlexContainer/VerticalFlexContainer';
import { Layout } from 'components/Layout/Layout';
import { Section } from 'components/Section/Section';
import { MineAapSoknadMedEttersendinger } from 'lib/types/types';
import { ArrowLeftIcon } from '@navikt/aksel-icons';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import metrics from 'lib/metrics';
import Head from 'next/head';
import { useIntl } from 'react-intl';
import { SoknadInnsending } from 'components/Soknad/SoknadInnsending';
import { getSøknaderMedEttersendinger } from 'pages/api/soknader/soknadermedettersendinger';

interface PageProps {
  søknaderMedEttersendinger: MineAapSoknadMedEttersendinger[];
}

const Søknader = ({ søknaderMedEttersendinger }: PageProps) => {
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
            {søknaderMedEttersendinger.map((søknad) => (
              <SoknadInnsending
                key={søknad.innsendingsId}
                søknad={søknad}
                ettersendelser={søknad.ettersendinger ?? []}
              />
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

  const søknaderMedEttersendinger = await getSøknaderMedEttersendinger(ctx.req);

  stopTimer();

  if (søknaderMedEttersendinger?.length > 0) {
    return {
      props: { søknaderMedEttersendinger: søknaderMedEttersendinger },
    };
  }
  logInfo('Fant ingen søknader med ettersendinger');
  return {
    props: { søknaderMedEttersendinger: [] },
  };
});

export default Søknader;
