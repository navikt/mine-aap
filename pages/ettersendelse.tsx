import { ReadMore, Label, BodyShort, Button, Heading, Link } from '@navikt/ds-react';
import { PageHeader } from 'components/PageHeader';
import { Section } from 'components/Section/Section';
import { beskyttetSide, getAccessToken } from '@navikt/aap-felles-utils';
import { GetServerSidePropsResult, NextPageContext } from 'next';
import * as styles from 'pages/[uuid]/ettersendelse/Ettersendelse.module.css';
import NextLink from 'next/link';
import { ArrowLeftIcon } from '@navikt/aksel-icons';
import { useRouter } from 'next/router';
import metrics from 'lib/metrics';
import { getSøknader, getSøknaderInnsending } from './api/soknader/soknader';
import { LucaGuidePanel, ScanningGuide, Vedlegg } from '@navikt/aap-felles-react';
import { useIntl } from 'react-intl';
import Head from 'next/head';
import { FileUpload } from 'components/fileupload/FileUpload';
import { Error, FormErrorSummary } from 'components/FormErrorSummary/FormErrorSummary';
import { useState } from 'react';
import { setFocus } from 'lib/utils/dom';

const Ettersendelse = () => {
  const { formatMessage } = useIntl();
  const router = useRouter();
  const { locale } = useIntl();

  const [errors, setErrors] = useState<Error[]>([]);
  const errorSummaryId = 'errorSummary';

  const addError = (errorsFromKrav: Error[]) => setErrors([...errors, ...errorsFromKrav]);
  const deleteError = (vedlegg: Vedlegg) => setErrors(errors.filter((error) => error.id !== vedlegg.vedleggId));

  return (
    <>
      <Head>
        <title>
          {`${formatMessage(
            { id: 'ettersendelse.appTittel' },
            {
              shy: '',
            }
          )} - nav.no`}
        </title>
      </Head>
      <PageHeader>
        {formatMessage(
          { id: 'ettersendelse.appTittel' },
          {
            shy: <>&shy;</>,
          }
        )}
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
            {formatMessage({ id: 'ettersendelse.heading' })}
          </Heading>
          <LucaGuidePanel>
            <BodyShort spacing>{formatMessage({ id: 'ettersendelse.annet.guide.tekst1' })}</BodyShort>
            <BodyShort spacing>{formatMessage({ id: 'ettersendelse.annet.guide.tekst2' })}</BodyShort>
          </LucaGuidePanel>
          <div>
            <Label>{formatMessage({ id: 'ettersendelse.annet.label' })}</Label>
            <BodyShort className={styles.annetTekst}>{formatMessage({ id: 'ettersendelse.annet.tekst' })}</BodyShort>
          </div>
          <div>
            <BodyShort>{formatMessage({ id: 'ettersendelse.slikTarDuBildeBeskrivelse' })}</BodyShort>
            <ReadMore header={formatMessage({ id: 'ettersendelse.slikTarDuBilde' })}>
              <ScanningGuide locale={locale} />
            </ReadMore>
          </div>
        </Section>

        <FormErrorSummary id={errorSummaryId} errors={errors} />

        <FileUpload
          krav="ANNET"
          addError={addError}
          deleteError={deleteError}
          setErrorSummaryFocus={() => setFocus(errorSummaryId)}
          onSuccess={() => {}}
          brukInnsending={true}
        />
        <Section>
          <div>
            <Button icon={<ArrowLeftIcon />} variant="tertiary" onClick={() => router.push('/')}>
              {formatMessage({ id: 'tilbakeTilMineAAPKnapp' })}
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
  const søknad = søknader[0];
  const søknaderFraInnsending = await getSøknaderInnsending(ctx.req);
  const søknadFraInnsending = søknaderFraInnsending.length > 0 ? søknaderFraInnsending[0] : undefined;

  stopTimer();

  if (søknad || søknadFraInnsending) {
    const søknadId = søknadFraInnsending?.innsendingsId ?? søknad.søknadId;
    return {
      redirect: {
        destination: `/${søknadId}/ettersendelse/`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
});

export default Ettersendelse;
