import { BodyShort, Button, Heading, Label, Link, ReadMore } from '@navikt/ds-react';
import { LucaGuidePanel, ScanningGuide, Vedlegg } from '@navikt/aap-felles-react';
import { GetServerSidePropsResult, NextPageContext } from 'next';
import { PageHeader } from 'components/PageHeader';
import { Section } from 'components/Section/Section';
import { InnsendingSøknad, Søknad, VedleggType } from 'lib/types/types';
import * as styles from 'pages/[uuid]/ettersendelse/Ettersendelse.module.css';
import { getSøknad } from 'pages/api/soknader/[uuid]';
import { getStringFromPossiblyArrayQuery } from '@navikt/aap-felles-utils-client';
import { beskyttetSide, getAccessToken, logger } from '@navikt/aap-felles-utils';
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
import { getSøknaderInnsending } from 'pages/api/soknader/soknader';

interface PageProps {
  søknad: Søknad | null;
  søknadFraInnsending?: InnsendingSøknad;
}

const Index = ({ søknad, søknadFraInnsending }: PageProps) => {
  const { formatMessage } = useIntl();
  const { locale } = useIntl();
  const søknadId = søknadFraInnsending ? søknadFraInnsending.innsendingsId : søknad?.søknadId;
  const [errors, setErrors] = useState<Error[]>([]);
  const [manglendeVedlegg, setManglendeVedlegg] = useState<VedleggType[]>(søknad?.manglendeVedlegg ?? []);

  const router = useRouter();

  const errorSummaryId = `form-error-summary-${søknadId ?? 'generic'}`;

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
            <BodyShort spacing>{formatMessage({ id: 'ettersendelse.guide' })}</BodyShort>
          </LucaGuidePanel>
          <Label>
            {formatMessage(
              { id: 'ettersendelse.gjeldendeSøknad' },
              {
                dateTime: formatFullDate(søknad?.innsendtDato),
              }
            )}
          </Label>
          {(manglendeVedlegg.length ?? 0) > 0 && (
            <div className={styles?.manglendeVedlegg}>
              <BodyShort spacing>{formatMessage({ id: 'ettersendelse.manglerDokumentasjon' })}</BodyShort>
              <ul>
                {manglendeVedlegg.map((krav) => (
                  <li key={krav}>
                    <Label>{formatMessage({ id: `ettersendelse.vedleggstyper.${krav}.heading` })}</Label>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <BodyShort>{formatMessage({ id: 'ettersendelse.slikTarDuBildeBeskrivelse' })}</BodyShort>
            <ReadMore header={formatMessage({ id: 'ettersendelse.slikTarDuBilde' })}>
              <ScanningGuide locale={locale} />
            </ReadMore>
          </div>
        </Section>

        <FormErrorSummary id={errorSummaryId} errors={errors} />

        {!søknadFraInnsending &&
          søknad?.manglendeVedlegg?.map((krav) => (
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
          søknadId={søknadId}
          krav="ANNET"
          addError={addError}
          deleteError={deleteError}
          setErrorSummaryFocus={() => setFocus(errorSummaryId)}
          onSuccess={() => {}}
          brukInnsending={Boolean(søknadFraInnsending)}
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
  const uuid = getStringFromPossiblyArrayQuery(ctx.query.uuid);
  logger.info('Server side på ettersendelse! =)');

  if (!uuid) {
    return {
      notFound: true,
    };
  }

  const stopTimer = metrics.getServersidePropsDurationHistogram.startTimer({
    path: '/{uuid}/ettersendelse',
  });

  const bearerToken = getAccessToken(ctx);

  try {
    const søknad = await getSøknad(uuid, bearerToken);
    const søknaderFraInnsending = await getSøknaderInnsending(bearerToken);

    const søknadFraInnsending = søknaderFraInnsending.find((søknad) => søknad.innsendingsId === uuid);
    logger.error('søknad', JSON.stringify(søknad));
    logger.error('søknad fra innsending', JSON.stringify(søknadFraInnsending));
    logger.error('søknader fra innsending', JSON.stringify(søknaderFraInnsending));
    stopTimer();

    if (!søknad && !søknadFraInnsending) {
      return {
        notFound: true,
      };
    }

    return {
      props: { søknad: søknad || null, søknadFraInnsending: {} },
    };
  } catch (e) {
    logger.error('Noe gikk galt i ettersendelse', e);
  }

  return { props: {} };
});

export default Index;
