import { ReadMore, Label, BodyShort, Button, Heading, Link } from '@navikt/ds-react';
import PageHeader from 'components/PageHeader';
import { Section } from 'components/Section/Section';
import { beskyttetSide, getAccessToken } from '@navikt/aap-felles-utils';
import { useFeatureToggleIntl } from 'lib/hooks/useFeatureToggleIntl';
import { GetServerSidePropsResult, NextPageContext } from 'next';
import * as styles from 'pages/[uuid]/ettersendelse/Ettersendelse.module.css';
import NextLink from 'next/link';
import { ArrowLeftIcon } from '@navikt/aksel-icons';
import { useRouter } from 'next/router';
import metrics from 'lib/metrics';
import { getSøknader } from './api/soknader/soknader';
import { LucaGuidePanel, ScanningGuide } from '@navikt/aap-felles-react';
import { useIntl } from 'react-intl';
import Head from 'next/head';
import { FileUpload } from 'components/fileupload/FileUpload';

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
              <ArrowLeftIcon />
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
          addError={() => {}}
          deleteError={() => {}}
          setErrorSummaryFocus={() => {}}
          onSuccess={() => {}}
        />
        <Section>
          <div>
            <Button icon={<ArrowLeftIcon />} variant="tertiary" onClick={() => router.push('/')}>
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
