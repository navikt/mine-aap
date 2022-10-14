import { Button, Heading, Link } from '@navikt/ds-react';
import { FileUpload } from 'components/Inputs/FileUpload';
import PageHeader from 'components/PageHeader';
import { Section } from 'components/Section/Section';
import { beskyttetSide } from 'lib/auth/beskyttetSide';
import { useFeatureToggleIntl } from 'lib/hooks/useFeatureToggleIntl';
import { GetServerSidePropsResult, NextPageContext } from 'next';
import * as styles from 'pages/[uuid]/ettersendelse/Ettersendelse.module.css';
import NextLink from 'next/link';
import { Left } from '@navikt/ds-icons';
import { useRouter } from 'next/router';
import metrics from 'lib/metrics';
import { getSøknader } from './api/soknader/soknader';
import { getAccessToken } from 'lib/auth/accessToken';

const Ettersendelse = () => {
  const { formatMessage } = useFeatureToggleIntl();

  const router = useRouter();

  return (
    <>
      <PageHeader align="center" variant="guide">
        {formatMessage('ettersendelse.appTittel')}
      </PageHeader>
      <main className={styles.main}>
        <Section>
          <NextLink href="/" passHref>
            <Link>
              <Left />
              Tilbake til Mine Arbeidsavklaringspenger
            </Link>
          </NextLink>
          <Heading level="2" size="medium" spacing>
            {formatMessage('ettersendelse.heading')}
          </Heading>
        </Section>

        <FileUpload
          krav="ANNET"
          updateErrorSummary={() => {}}
          setErrorSummaryFocus={() => {}}
          onEttersendSuccess={() => {}}
        />

        <Section>
          <div>
            <Button icon={<Left />} variant="tertiary" onClick={() => router.push('/')}>
              Tilbake til Mine Arbeidsavklaringspenger
            </Button>
          </div>
        </Section>
      </main>
    </>
  );
};

export const getServerSideProps = beskyttetSide(
  async (ctx: NextPageContext): Promise<GetServerSidePropsResult<{}>> => {
    const stopTimer = metrics.getServersidePropsDurationHistogram.startTimer({
      path: '/ettersendelse',
    });
    const bearerToken = getAccessToken(ctx);
    const params = { page: '0', size: '1', sort: 'created,desc' };
    const søknader = await getSøknader(params, bearerToken);
    stopTimer();

    if (søknader.length > 0) {
      return {
        redirect: {
          destination: `/${søknader[0].søknadId}/ettersendelse/`,
          permanent: false,
        },
      };
    }

    return {
      props: {},
    };
  }
);

export default Ettersendelse;