'use client';

import { Ettersendelse, VedleggType } from 'lib/types/types';
import { Section } from 'components/Section/Section';
import { Alert, BodyShort, Button, Heading } from '@navikt/ds-react';
import React, { useState } from 'react';
import { Error } from 'components/FormErrorSummary/FormErrorSummary';

import styles from 'components/fileupload/FileUpload.module.css';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { FileInputInnsending, Vedlegg } from 'components/FileUploadInnsending/FileInputInnsending';

interface Props {
  søknadId?: string;
  krav: VedleggType;
  addError: (errors: Error[]) => void;
  deleteError: (vedlegg: Vedlegg) => void;
  setErrorSummaryFocus: () => void;
  onSuccess: (krav: VedleggType) => void;
}

const findErrors = (vedlegg: Vedlegg[], krav: string) =>
  vedlegg
    .filter((file) => file.errorMessage)
    .map((errorFile) => {
      return { path: krav, message: errorFile.errorMessage, id: errorFile.vedleggId };
    });

export const FileUpload = ({ søknadId, krav, addError, deleteError, onSuccess, setErrorSummaryFocus }: Props) => {
  const t = useTranslations('ettersendelse');

  const { locale = 'nb' } = useParams<{ locale: string }>();

  const [files, setFiles] = useState<Vedlegg[]>([]);
  const [harLastetOppEttersending, setHarLastetOppEttersending] = useState<boolean>(false);
  const [harEttersendingError, setHarEttersendingError] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const kravErAnnet = krav === 'ANNET';
  const successWrapperKlassenavn = kravErAnnet ? styles.successWrapperAnnet : styles.successWrapper;
  const harFeilmeldinger = files.some((file) => file.errorMessage);
  const visSendInnKnapp = !harLastetOppEttersending && files.length > 0;

  const onClick = async () => {
    setIsUploading(true);
    if (harFeilmeldinger) {
      setErrorSummaryFocus();
      setIsUploading(false);
      return;
    }

    const ettersendelse: Ettersendelse = {
      ...(søknadId && { søknadId: søknadId }),
      totalFileSize: files.reduce((acc, curr) => acc + curr.size, 0),
      ettersendteVedlegg: [
        {
          vedleggType: krav,
          ettersending: files.map((file) => file.vedleggId),
        },
      ],
    };

    const url = '/aap/mine-aap/api/ettersendelseinnsending/send/';

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(ettersendelse),
      });
      if (response.ok) {
        setFiles([]);
        setHarLastetOppEttersending(true);
        onSuccess(krav);
      } else {
        setHarEttersendingError(true);
      }
    } catch (err) {
      console.log(err);
      setHarEttersendingError(true);
    }
    setIsUploading(false);
  };

  return (
    <Section>
      <div className={styles.fileinputWrapper}>
        {(!harLastetOppEttersending || kravErAnnet) && (
          <FileInputInnsending
            heading={t(`vedleggstyper.${krav}.heading`)}
            ingress={t(`vedleggstyper.${krav}.description`)}
            readAttachmentUrl={`/aap/mine-aap/${locale}/vedlegg/`}
            onUpload={(vedlegg) => {
              if (harLastetOppEttersending) {
                setHarLastetOppEttersending(false);
              }
              const errors = findErrors(vedlegg, krav);
              errors && addError(errors);
              setFiles([...files, ...vedlegg]);
            }}
            onDelete={(vedlegg) => {
              if (vedlegg.errorMessage) {
                deleteError(vedlegg);
              }

              const newFiles = files.filter((file) => file.vedleggId !== vedlegg.vedleggId);
              setFiles(newFiles);
            }}
            deleteUrl={'/aap/mine-aap/api/vedlegginnsending/slett/?uuid='}
            uploadUrl={'/aap/mine-aap/api/vedlegginnsending/lagre/'}
            files={files}
          />
        )}
        {harLastetOppEttersending && (
          <div className={successWrapperKlassenavn}>
            {!kravErAnnet && (
              <>
                <Heading size={'medium'}>{t(`vedleggstyper.${krav}.heading`)}</Heading>
                <BodyShort>{t(`vedleggstyper.${krav}.description`)}</BodyShort>
              </>
            )}
            <Alert variant="success">
              {kravErAnnet ? (
                <BodyShort>
                  Takk! Dokumentasjonen er nå sendt inn! Har du flere dokumenter du ønsker å sende, kan du laste de opp
                  over.
                </BodyShort>
              ) : (
                <BodyShort>
                  Takk! Dokumentasjonen er nå sendt inn! Har du flere dokumenter du ønsker å sende, kan du laste de opp
                  under &quot;Annen dokumentasjon&quot;.
                </BodyShort>
              )}
            </Alert>
          </div>
        )}
        {harEttersendingError && (
          <Alert variant="error">
            Beklager, vi har litt rusk i Navet. Du kan prøve på nytt om et par minutter, eller sende inn dokumentasjonen
            på papir.
          </Alert>
        )}
        {visSendInnKnapp && (
          <Button onClick={onClick} loading={isUploading} className={styles.sendButton}>
            Send inn
          </Button>
        )}
      </div>
    </Section>
  );
};
