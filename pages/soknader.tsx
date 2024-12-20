import { Button, Heading, Link } from '@navikt/ds-react';
import { GetServerSidePropsResult, NextPageContext } from 'next';
import { beskyttetSide } from '@navikt/aap-felles-utils';
import { VerticalFlexContainer } from 'components/FlexContainer/VerticalFlexContainer';
import { Layout } from 'components/Layout/Layout';
import { Section } from 'components/Section/Section';
import { InnsendingSøknad, MineAapSoknadMedEttersendinger } from 'lib/types/types';
import { getSøknaderInnsending } from 'pages/api/soknader/soknader';
import { ArrowLeftIcon } from '@navikt/aksel-icons';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import metrics from 'lib/metrics';
import Head from 'next/head';
import { useIntl } from 'react-intl';
import { SoknadInnsending } from 'components/Soknad/SoknadInnsending';
import { getEttersendelserForSøknad } from 'pages/api/soknader/[uuid]/ettersendelser';

interface PageProps {
  innsendingSøknader: InnsendingSøknad[];
  søknaderMedEttersending: MineAapSoknadMedEttersendinger[];
}

const Søknader = ({ innsendingSøknader, søknaderMedEttersending }: PageProps) => {
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
            {innsendingSøknader.map((søknad) => (
              <SoknadInnsending
                key={søknad.innsendingsId}
                søknad={søknad}
                ettersendelser={
                  søknaderMedEttersending.find(
                    (søknadMedEttersending) => søknadMedEttersending.innsendingsId === søknad.innsendingsId
                  )?.ettersendinger ?? []
                }
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

  const innsendingSøknader = await getSøknaderInnsending(ctx.req);

  const søknaderMedEttersending = [];

  for (const søknad of innsendingSøknader) {
    const søknadMedEttersending = await getEttersendelserForSøknad(søknad.innsendingsId as string, ctx.req);
    søknaderMedEttersending.push(søknadMedEttersending);
  }

  stopTimer();
  return {
    props: { innsendingSøknader, søknaderMedEttersending },
  };
});

export default Søknader;
