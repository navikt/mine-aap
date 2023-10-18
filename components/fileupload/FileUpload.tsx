import { Ettersendelse, VedleggType } from 'lib/types/types';
import { FileInput, Vedlegg } from '@navikt/aap-felles-react';
import { Section } from 'components/Section/Section';
import { Alert, BodyShort, Button, Heading } from '@navikt/ds-react';
import React, { useState } from 'react';
import { Error } from 'components/FormErrorSummary/FormErrorSummary';
import { useIntl } from 'react-intl';

import styles from 'components/fileupload/FileUpload.module.css';

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
  const { formatMessage } = useIntl();
  const [files, setFiles] = useState<Vedlegg[]>([]);
  const [harLastetOppEttersending, setHarLastetOppEttersending] = useState<boolean>(false);
  const [harEttersendingError, setHarEttersendingError] = useState<boolean>(false);

  const kravErAnnet = krav === 'ANNET';
  const successWrapperKlassenavn = kravErAnnet ? styles.successWrapperAnnet : styles.successWrapper;
  const harFeilmeldinger = files.some((file) => file.errorMessage);
  const visSendInnKnapp = !harLastetOppEttersending && files.length > 0;

  const onClick = async () => {
    if (harFeilmeldinger) {
      setErrorSummaryFocus();
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

    try {
      const response = await fetch('/aap/mine-aap/api/ettersendelse/send/', {
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
  };

  return (
    <Section>
      <div className={styles.fileinputWrapper}>
        {(!harLastetOppEttersending || kravErAnnet) && (
          <FileInput
            heading={formatMessage({ id: `ettersendelse.vedleggstyper.${krav}.heading` })}
            ingress={formatMessage({ id: `ettersendelse.vedleggstyper.${krav}.description` })}
            readAttachmentUrl={'/aap/mine-aap/vedlegg/'}
            id={krav}
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
            deleteUrl={'/aap/mine-aap/api/vedlegg/slett/?uuid='}
            uploadUrl={'/aap/mine-aap/api/vedlegg/lagre/'}
            files={files}
          />
        )}
        {harLastetOppEttersending && (
          <div className={successWrapperKlassenavn}>
            {!kravErAnnet && (
              <>
                <Heading size={'medium'}>
                  {formatMessage({ id: `ettersendelse.vedleggstyper.${krav}.heading` })}
                </Heading>
                <BodyShort>{formatMessage({ id: `ettersendelse.vedleggstyper.${krav}.description` })}</BodyShort>
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
            Beklager, vi har litt rusk i NAVet. Du kan prøve på nytt om et par minutter, eller sende inn dokumentasjonen
            på papir.
          </Alert>
        )}
        {visSendInnKnapp && (
          <Button onClick={onClick} className={styles.sendButton}>
            Send inn
          </Button>
        )}
      </div>
    </Section>
  );
};
