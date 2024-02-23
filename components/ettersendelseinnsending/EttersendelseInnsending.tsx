import { FormattedMessage, useIntl } from 'react-intl';
import { InnsendingSøknad } from 'lib/types/types';
import { useState } from 'react';
import { Error, FormErrorSummary } from 'components/FormErrorSummary/FormErrorSummary';
import { useRouter } from 'next/router';
import { LucaGuidePanel, ScanningGuide, Vedlegg } from '@navikt/aap-felles-react';
import Head from 'next/head';
import { PageHeader } from 'components/PageHeader';
import * as styles from 'pages/[uuid]/ettersendelse/Ettersendelse.module.css';
import { Section } from 'components/Section/Section';
import NextLink from 'next/link';
import { BodyShort, Button, Heading, Label, Link, ReadMore } from '@navikt/ds-react';
import { ArrowLeftIcon } from '@navikt/aksel-icons';
import { formatFullDate } from 'lib/utils/date';
import { FileUpload } from 'components/fileupload/FileUpload';
import { setFocus } from 'lib/utils/dom';
import { FileUploadWithCategory } from 'components/fileuploadwithcategory/FileUploadWithCategory';
import { FileInputV3 } from 'components/fileinput_v3/FileInputV3';
import { FileInputV2 } from 'components/fileinput_v2/FileInputV2';

interface Props {
  søknad: InnsendingSøknad;
}

export const EttersendelseInnsending = ({ søknad }: Props) => {
  const { formatMessage } = useIntl();
  const { locale } = useIntl();
  const [errors, setErrors] = useState<Error[]>([]);

  const router = useRouter();

  const errorSummaryId = `form-error-summary-${søknad.innsendingsId ?? 'generic'}`;

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
            <BodyShort spacing>{formatMessage({ id: 'ettersendelse.guide' })}</BodyShort>
            <BodyShort spacing>
              <FormattedMessage
                id={'ettersendelse.guide2'}
                values={{
                  a: (chunks) => (
                    <Link
                      target="_blank"
                      href={
                        'https://www.nav.no/soknader/nb/person/arbeid/arbeidsavklaringspenger/NAV%2011-13.05/ettersendelse'
                      }
                    >
                      {chunks}
                    </Link>
                  ),
                }}
              />
            </BodyShort>
          </LucaGuidePanel>
          <Label>
            {formatMessage(
              { id: 'ettersendelse.gjeldendeSøknad' },
              {
                dateTime: formatFullDate(søknad.mottattDato),
              }
            )}
          </Label>
          <div>
            <BodyShort>{formatMessage({ id: 'ettersendelse.slikTarDuBildeBeskrivelse' })}</BodyShort>
            <ReadMore header={formatMessage({ id: 'ettersendelse.slikTarDuBilde' })}>
              <ScanningGuide locale={locale} />
            </ReadMore>
          </div>
        </Section>

        <FormErrorSummary id={errorSummaryId} errors={errors} />
        <FileInputV2 />
        {/*<FileInputV3 />*/}

        {/*<FileUpload*/}
        {/*  søknadId={søknad.innsendingsId}*/}
        {/*  krav="ANNET"*/}
        {/*  addError={addError}*/}
        {/*  deleteError={deleteError}*/}
        {/*  setErrorSummaryFocus={() => setFocus(errorSummaryId)}*/}
        {/*  onSuccess={() => {}}*/}
        {/*  brukInnsending={true}*/}
        {/*/>*/}

        {/*<FileUploadWithCategory addError={addError} deleteError={deleteError} />*/}

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
