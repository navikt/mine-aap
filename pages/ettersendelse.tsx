import { ReadMore, Label, BodyShort, Button, Heading, Link } from '@navikt/ds-react';
import { FileUpload } from 'components/Inputs/FileUpload';
import PageHeader from 'components/PageHeader';
import { Section } from 'components/Section/Section';
import { beskyttetSide, getAccessToken } from '@navikt/aap-felles-innbygger-utils';
import { GetServerSidePropsResult, NextPageContext } from 'next';
import * as styles from 'pages/[uuid]/ettersendelse/Ettersendelse.module.css';
import NextLink from 'next/link';
import { Left } from '@navikt/ds-icons';
import { useRouter } from 'next/router';
import metrics from 'lib/metrics';
import { getSøknader } from './api/soknader/soknader';
import { LucaGuidePanel, ScanningGuide } from '@navikt/aap-felles-innbygger-react';
import { FormattedMessage, useIntl } from 'react-intl';
import Head from 'next/head';

const Ettersendelse = () => {
  const intl = useIntl();
  const { locale } = useIntl();

  const router = useRouter();

  return (
    <>
      <Head>
        <title>
          {`${intl.formatMessage(
            { id: 'ettersendelse.appTittel' },
            {
              shy: '',
            }
          )} - nav.no`}
        </title>
      </Head>
      <PageHeader align="center" variant="guide">
        <FormattedMessage
          id="ettersendelse.appTittel"
          values={{
            shy: <>&shy;</>,
          }}
        />
      </PageHeader>
      <main className={styles.main}>
        <Section>
          <NextLink href="/" passHref legacyBehavior>
            <Link>
              <Left />
              Tilbake til Mine Arbeidsavklaringspenger
            </Link>
          </NextLink>
          <Heading level="2" size="large" spacing>
            <FormattedMessage id="ettersendelse.heading" />
          </Heading>
          <LucaGuidePanel>
            <BodyShort spacing>
              <FormattedMessage id="ettersendelse.annet.guide.tekst1" />
            </BodyShort>
            <BodyShort spacing>
              <FormattedMessage id="ettersendelse.annet.guide.tekst2" />
            </BodyShort>
          </LucaGuidePanel>
          <div>
            <Label>
              <FormattedMessage id="ettersendelse.annet.label" />
            </Label>
            <BodyShort className={styles.annetTekst}>
              <FormattedMessage id="ettersendelse.annet.tekst" />
            </BodyShort>
          </div>
          <div>
            <BodyShort>
              <FormattedMessage id="ettersendelse.slikTarDuBildeBeskrivelse" />
            </BodyShort>
            <ReadMore header={<FormattedMessage id="ettersendelse.slikTarDuBilde" />}>
              <ScanningGuide locale={locale} />
            </ReadMore>
          </div>
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
              <FormattedMessage id="tilbakeTilMineAAPKnapp" />
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
