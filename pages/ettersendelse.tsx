import { LucaGuidePanel, ScanningGuide } from '@navikt/aap-felles-innbygger-react';
import { beskyttetSide, getAccessToken } from '@navikt/aap-felles-innbygger-utils';
import { Left } from '@navikt/ds-icons';
import { BodyShort, Button, Heading, Label, Link, ReadMore } from '@navikt/ds-react';
import { useFeatureToggleIntl } from 'lib/hooks/useFeatureToggleIntl';
import metrics from 'lib/metrics';
import { GetServerSidePropsResult, NextPageContext } from 'next';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import * as styles from 'pages/[uuid]/ettersendelse/Ettersendelse.module.css';
import { useIntl } from 'react-intl';

import { FileUpload } from 'components/Inputs/FileUpload';
import PageHeader from 'components/PageHeader';
import { Section } from 'components/Section/Section';

import { getSøknader } from './api/soknader/soknader';

const Ettersendelse = () => {
  const { formatMessage, formatElement } = useFeatureToggleIntl();
  const { locale } = useIntl();

  const router = useRouter();

  return (
    <>
      <Head>
        <title>
          {`${formatElement('ettersendelse.appTittel', {
            shy: '',
          })} - nav.no`}
        </title>
      </Head>
      <PageHeader align="center" variant="guide">
        {formatElement('ettersendelse.appTittel', {
          shy: <>&shy;</>,
        })}
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
            {formatMessage('ettersendelse.heading')}
          </Heading>
          <LucaGuidePanel>
            <BodyShort spacing>{formatMessage('ettersendelse.annet.guide.tekst1')}</BodyShort>
            <BodyShort spacing>{formatMessage('ettersendelse.annet.guide.tekst2')}</BodyShort>
          </LucaGuidePanel>
          <div>
            <Label>{formatMessage('ettersendelse.annet.label')}</Label>
            <BodyShort className={styles.annetTekst}>{formatMessage('ettersendelse.annet.tekst')}</BodyShort>
          </div>
          <div>
            <BodyShort>{formatMessage('ettersendelse.slikTarDuBildeBeskrivelse')}</BodyShort>
            <ReadMore header={formatMessage('ettersendelse.slikTarDuBilde')}>
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
              {formatMessage('tilbakeTilMineAAPKnapp')}
            </Button>
          </div>
        </Section>
      </main>
    </>
  );
};

export const getServerSideProps = beskyttetSide(async (ctx: NextPageContext): Promise<GetServerSidePropsResult<{}>> => {
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
});

export default Ettersendelse;
