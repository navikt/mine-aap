import { BodyShort, Button, Heading, Label, Link, ReadMore } from '@navikt/ds-react';
import { LucaGuidePanel, ScanningGuide, Vedlegg } from '@navikt/aap-felles-react';
import { GetServerSidePropsResult, NextPageContext } from 'next';
import PageHeader from 'components/PageHeader';
import { Section } from 'components/Section/Section';
import { useFeatureToggleIntl } from 'lib/hooks/useFeatureToggleIntl';
import { Søknad, VedleggType } from 'lib/types/types';
import * as styles from 'pages/[uuid]/ettersendelse/Ettersendelse.module.css';
import { getSøknad } from 'pages/api/soknader/[uuid]';
import { getStringFromPossiblyArrayQuery } from '@navikt/aap-felles-utils-client';
import { beskyttetSide, getAccessToken } from '@navikt/aap-felles-utils';
import { useState } from 'react';
import { Error, FormErrorSummary } from 'components/FormErrorSummary/FormErrorSummary';
import { setFocus } from 'lib/utils/dom';
import NextLink from 'next/link';
import { ArrowLeftIcon } from '@navikt/aksel-icons';
import { useRouter } from 'next/router';
import metrics from 'lib/metrics';
import { formatFullDate } from 'lib/utils/date';
import { useIntl } from 'react-intl';
import Head from 'next/head';
import { FileUpload } from 'components/fileupload/FileUpload';

interface PageProps {
  søknad: Søknad;
}

const Index = ({ søknad }: PageProps) => {
  const { formatMessage, formatElement } = useFeatureToggleIntl();
  const { locale } = useIntl();

  const [errors, setErrors] = useState<Error[]>([]);
  const [manglendeVedlegg, setManglendeVedlegg] = useState<VedleggType[]>(søknad.manglendeVedlegg ?? []);

  const router = useRouter();

  const errorSummaryId = `form-error-summary-${søknad?.søknadId ?? 'generic'}`;

  const addError = (errorsFromKrav: Error[]) => setErrors([...errors, ...errorsFromKrav]);

  const deleteError = (vedlegg: Vedlegg) => setErrors(errors.filter((error) => error.id !== vedlegg.vedleggId));

  const onEttersendelseSuccess = (krav: string) => {
    const updatedManglendeVedlegg = manglendeVedlegg.filter((vedlegg) => vedlegg !== krav);
    setManglendeVedlegg(updatedManglendeVedlegg);
  };

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
            <BodyShort spacing>{formatMessage('ettersendelse.guide')}</BodyShort>
          </LucaGuidePanel>
          <Label>
            {formatMessage('ettersendelse.gjeldendeSøknad', {
              dateTime: formatFullDate(søknad.innsendtDato),
            })}
          </Label>
          {(manglendeVedlegg.length ?? 0) > 0 && (
            <div className={styles?.manglendeVedlegg}>
              <BodyShort spacing>{formatMessage('ettersendelse.manglerDokumentasjon')}</BodyShort>
              <ul>
                {manglendeVedlegg.map((krav) => (
                  <li key={krav}>
                    <Label>{formatMessage(`ettersendelse.vedleggstyper.${krav}.heading`)}</Label>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <BodyShort>{formatMessage('ettersendelse.slikTarDuBildeBeskrivelse')}</BodyShort>
            <ReadMore header={formatMessage('ettersendelse.slikTarDuBilde')}>
              <ScanningGuide locale={locale} />
            </ReadMore>
          </div>
        </Section>

        <FormErrorSummary id={errorSummaryId} errors={errors} />

        {søknad.manglendeVedlegg?.map((krav) => (
          <FileUpload
            søknadId={søknad.søknadId}
            krav={krav}
            addError={addError}
            deleteError={deleteError}
            setErrorSummaryFocus={() => setFocus(errorSummaryId)}
            onSuccess={(krav) => onEttersendelseSuccess(krav)}
            key={krav}
          />
        ))}

        <FileUpload
          søknadId={søknad.søknadId}
          krav="ANNET"
          addError={addError}
          deleteError={deleteError}
          setErrorSummaryFocus={() => setFocus(errorSummaryId)}
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
    path: '/{uuid}/ettersendelse',
  });
  const bearerToken = getAccessToken(ctx);
  const uuid = getStringFromPossiblyArrayQuery(ctx.query.uuid);
  const søknad = await getSøknad(uuid as string, bearerToken);

  stopTimer();
  if (!søknad) {
    return {
      notFound: true,
    };
  }

  return {
    props: { søknad },
  };
});

export default Index;
