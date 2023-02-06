import { BodyShort, Button, Heading, Label, Link, ReadMore } from '@navikt/ds-react';
import { LucaGuidePanel, ScanningGuide } from '@navikt/aap-felles-innbygger-react';
import { GetServerSidePropsResult, NextPageContext } from 'next';
import { FileUpload } from 'components/Inputs/FileUpload';
import PageHeader from 'components/PageHeader';
import { Section } from 'components/Section/Section';
import { useFeatureToggleIntl } from 'lib/hooks/useFeatureToggleIntl';
import { Søknad, VedleggType } from 'lib/types/types';
import * as styles from 'pages/[uuid]/ettersendelse/Ettersendelse.module.css';
import { getSøknad } from 'pages/api/soknader/[uuid]';
import { getStringFromPossiblyArrayQuery } from '@navikt/aap-felles-utils-client';
import { logger, beskyttetSide, getAccessToken } from '@navikt/aap-felles-innbygger-utils';
import { useState } from 'react';
import { FieldErrors } from 'react-hook-form';
import { FormErrorSummary } from 'components/FormErrorSummary/FormErrorSummary';
import { setFocus } from 'lib/utils/dom';
import NextLink from 'next/link';
import { Left } from '@navikt/ds-icons';
import { useRouter } from 'next/router';
import metrics from 'lib/metrics';
import { formatFullDate } from 'lib/utils/date';
import { FormattedMessage, useIntl } from 'react-intl';
import Head from 'next/head';

interface PageProps {
  søknad: Søknad;
}

const Index = ({ søknad }: PageProps) => {
  const { locale } = useIntl();

  const [errors, setErrors] = useState<FieldErrors>({});
  const [manglendeVedlegg, setManglendeVedlegg] = useState<VedleggType[]>(
    søknad.manglendeVedlegg ?? []
  );

  const router = useRouter();

  const errorSummaryId = `form-error-summary-${søknad?.søknadId ?? 'generic'}`;

  const updateErrorSummary = (errorsFromKrav: FieldErrors, krav: string) => {
    const updatedErrors = { ...errors, [krav]: errorsFromKrav[krav] };
    const filteredErrors = Object.keys(updatedErrors).reduce((object, key) => {
      if (updatedErrors[key]) {
        // @ts-ignore
        object[key] = updatedErrors[key];
      }
      return object;
    }, {});

    setErrors(filteredErrors);
  };

  const onEttersendelseSuccess = (krav: string) => {
    const updatedManglendeVedlegg = manglendeVedlegg.filter((vedlegg) => vedlegg !== krav);
    setManglendeVedlegg(updatedManglendeVedlegg);
  };

  return (
    <>
      <Head>
        <title>
          {`${(
            <FormattedMessage
              id="ettersendelse.appTittel"
              values={{
                shy: '',
              }}
            />
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
              <FormattedMessage id="ettersendelse.guide" />
            </BodyShort>
          </LucaGuidePanel>
          <Label>
            <FormattedMessage
              id="ettersendelse.gjeldendeSøknad"
              values={{
                dateTime: formatFullDate(søknad.innsendtDato),
              }}
            />
          </Label>
          {(manglendeVedlegg.length ?? 0) > 0 && (
            <div className={styles?.manglendeVedlegg}>
              <BodyShort spacing>
                <FormattedMessage id="ettersendelse.manglerDokumentasjon" />
              </BodyShort>
              <ul>
                {manglendeVedlegg.map((krav) => (
                  <li key={krav}>
                    <Label>
                      <FormattedMessage id={`ettersendelse.vedleggstyper.${krav}.heading`} />
                    </Label>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <BodyShort>
              <FormattedMessage id="ettersendelse.slikTarDuBildeBeskrivelse" />
            </BodyShort>
            <ReadMore header={<FormattedMessage id="ettersendelse.slikTarDuBilde" />}>
              <ScanningGuide locale={locale} />
            </ReadMore>
          </div>
        </Section>

        <FormErrorSummary id={errorSummaryId} errors={errors} />

        {søknad.manglendeVedlegg?.map((krav) => (
          <FileUpload
            søknadId={søknad.søknadId}
            krav={krav}
            updateErrorSummary={updateErrorSummary}
            setErrorSummaryFocus={() => setFocus(errorSummaryId)}
            onEttersendSuccess={(krav) => onEttersendelseSuccess(krav)}
            key={krav}
          />
        ))}

        <FileUpload
          søknadId={søknad.søknadId}
          krav="ANNET"
          updateErrorSummary={updateErrorSummary}
          setErrorSummaryFocus={() => setFocus(errorSummaryId)}
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
      path: '/{uuid}/ettersendelse',
    });
    const bearerToken = getAccessToken(ctx);
    const uuid = getStringFromPossiblyArrayQuery(ctx.query.uuid);
    const søknad = await getSøknad(uuid as string, bearerToken);

    logger.info(`Søknad ${JSON.stringify(søknad)}`);
    stopTimer();
    if (!søknad) {
      return {
        notFound: true,
      };
    }

    return {
      props: { søknad },
    };
  }
);

export default Index;
