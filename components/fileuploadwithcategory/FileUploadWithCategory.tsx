import { FileInputInnsending, Vedlegg } from '@navikt/aap-felles-react';
import { useIntl } from 'react-intl';
import { Section } from 'components/Section/Section';
import { Alert, BodyShort, Button, Select } from '@navikt/ds-react';
import React, { useState } from 'react';
import { Error } from 'components/FormErrorSummary/FormErrorSummary';
import styles from 'components/fileupload/FileUpload.module.css';
import { Ettersendelse, VedleggType } from 'lib/types/types';

const vedleggstyper: VedleggType[] = ['STUDIER', 'ARBEIDSGIVER', 'OMSORG', 'UTLAND', 'ANDREBARN', 'ANNET'];

const findErrors = (vedlegg: Vedlegg[]) =>
  vedlegg
    .filter((fil) => fil.errorMessage)
    .map((fil) => ({ path: 'generisk', message: fil.errorMessage, id: fil.vedleggId }));

type Props = {
  søknadId?: string;
  addError: (errors: Error[]) => void;
  deleteError: (vedlegg: Vedlegg) => void;
};

export const FileUploadWithCategory = ({ søknadId, addError, deleteError }: Props) => {
  const { formatMessage } = useIntl();
  const [files, setFiles] = useState<Vedlegg[]>([]);
  const [harLastetOppEttersending, setHarLastetOppEttersending] = useState<boolean>(false);
  const [harEttersendingError, setHarEttersendingError] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [valgtVedleggstype, setValgtVedleggstype] = useState<VedleggType | undefined>();
  const [vedleggstypeerror, setVedleggstypeError] = useState<Error | undefined>();
  const visSendInnKnapp = files.length > 0;

  const vedleggOptions: { label: string; value: VedleggType | undefined }[] = vedleggstyper.map((vedleggstype) => ({
    label: formatMessage({ id: `ettersendelse.vedleggstyper.${vedleggstype}.heading` }),
    value: vedleggstype,
  }));

  vedleggOptions.unshift({
    label: formatMessage({ id: 'ettersendelse.generisk.dokumenttyper.placeholder' }),
    value: undefined,
  });

  const onClick = async () => {
    if (!valgtVedleggstype) {
      const error = {
        path: 'vedleggstype',
        message: formatMessage({ id: 'ettersendelse.generisk.dokumenttyper.ikkevalgt' }),
        id: 'vedleggstype',
      };
      addError([error]);
      setVedleggstypeError(error);
      return;
    }
    setIsUploading(true);

    const ettersendelse: Ettersendelse = {
      ...(søknadId && { søknadId: søknadId }),
      totalFileSize: files.reduce((acc, curr) => acc + curr.size, 0),
      ettersendteVedlegg: [
        {
          vedleggType: valgtVedleggstype,
          ettersending: files.map((file) => file.vedleggId),
        },
      ],
    };

    try {
      const response = await fetch('/aap/mine-aap/api/ettersendelseinnsending/send/', {
        method: 'POST',
        body: JSON.stringify(ettersendelse),
      });
      if (response.ok) {
        setFiles([]);
        setHarLastetOppEttersending(true);
      } else {
        setHarEttersendingError(true);
      }
    } catch (err) {
      console.log(err);
      setHarEttersendingError(true);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Section>
      <Select
        label={formatMessage({ id: 'ettersendelse.generisk.dokumenttyper.heading' })}
        onChange={(event) => {
          setValgtVedleggstype(event.target.value as VedleggType);
          setVedleggstypeError(undefined);
        }}
        id={'vedleggtype'}
        error={vedleggstypeerror && vedleggstypeerror.message}
      >
        {vedleggOptions.map((vedlegg) => (
          <option key={vedlegg.label} value={vedlegg.value}>
            {vedlegg.label}
          </option>
        ))}
      </Select>
      <FileInputInnsending
        heading={formatMessage({ id: 'ettersendelse.generisk.heading' })}
        ingress={formatMessage({ id: 'ettersendelse.generisk.description' })}
        readAttachmentUrl={'/aap/mine-aap/vedlegg'}
        id={'generisk'}
        onUpload={(vedlegg) => {
          const errors = findErrors(vedlegg);
          errors && addError(errors);
          setFiles([...files, ...vedlegg]);
        }}
        onDelete={(vedlegg) => {
          if (vedlegg.errorMessage) {
            deleteError(vedlegg);
          }

          const newFiles = files.filter((fil) => fil.vedleggId !== vedlegg.vedleggId);
          setFiles(newFiles);
        }}
        deleteUrl={'/aap/mine-aap/api/vedlegginnsending/slett/?uuid='}
        uploadUrl={'/aap/mine-aap/api/vedlegginnsending/lagre/'}
        files={files}
      />
      {harLastetOppEttersending && (
        <div className={styles.successWrapper}>
          <Alert variant="success">
            <BodyShort>
              Takk! Dokumentasjonen er nå sendt inn! Har du flere dokumenter du ønsker å sende, kan du laste de opp
              over.
            </BodyShort>
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
        <Button onClick={onClick} loading={isUploading} className={styles.sendButton}>
          Send inn
        </Button>
      )}
    </Section>
  );
};
