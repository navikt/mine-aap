import { Ettersendelse, VedleggType } from 'lib/types/types';
import { FileInput, Vedlegg } from '@navikt/aap-felles-react';
import { useFeatureToggleIntl } from 'lib/hooks/useFeatureToggleIntl';
import { Section } from 'components/Section/Section';
import { Alert, Button } from '@navikt/ds-react';
import React, { useState } from 'react';
import { Error } from 'components/FormErrorSummary/FormErrorSummary';

import styles from './FileUploadNew.module.css';

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

export const FileUploadNew = ({ søknadId, krav, addError, deleteError, onSuccess }: Props) => {
  const { formatMessage } = useFeatureToggleIntl();
  const [files, setFiles] = useState<Vedlegg[]>([]);
  const [harLastetOppEttersending, setHarLastetOppEttersending] = useState<boolean>(false);
  const [harEttersendingError, setHarEttersendingError] = useState<boolean>(false);

  const harFeilmeldinger = files.some((file) => file.errorMessage);
  const visSendInnKnapp = !harLastetOppEttersending && files.length > 0;

  const onClick = async () => {
    if (harFeilmeldinger) {
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
        <FileInput
          heading={formatMessage(`ettersendelse.vedleggstyper.${krav}.heading`)}
          ingress={formatMessage(`ettersendelse.vedleggstyper.${krav}.description`)}
          id={krav}
          onUpload={(vedlegg) => {
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
        {harLastetOppEttersending && (
          <Alert variant="success">
            {krav === 'ANNET' ? (
              <>
                Takk! Dokumentasjonen er nå sendt inn! Har du flere dokumenter du ønsker å sende, kan du laste de opp
                under.
              </>
            ) : (
              <>
                Takk! Dokumentasjonen er nå sendt inn! Har du flere dokumenter du ønsker å sende, kan du laste de opp
                under &quot;Annen dokumentasjon&quot;.
              </>
            )}
          </Alert>
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
