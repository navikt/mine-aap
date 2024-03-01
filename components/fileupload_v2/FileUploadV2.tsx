import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Ettersendelse, VedleggType } from 'lib/types/types';
import { Vedlegg } from '@navikt/aap-felles-react';
import { Section } from 'components/Section/Section';
import { FileInputMinimal } from 'components/fileupload_v2/FileInputMinimal';
import { Error } from 'components/FormErrorSummary/FormErrorSummary';
import { Alert, BodyShort, Button, Heading, Select } from '@navikt/ds-react';
import styles from 'components/fileupload_v2/FileUploadV2.module.css';

const findErrors = (vedlegg: Vedlegg[], vedleggType: string) =>
  vedlegg
    .filter((file) => file.errorMessage)
    .map((errorFile) => {
      return { path: vedleggType, message: errorFile.errorMessage, id: errorFile.vedleggId };
    });

interface Props {
  addError: (errors: Error[]) => void;
  deleteError: (vedlegg: Vedlegg) => void;
  setErrorSummaryFocus: () => void;
}

const vedleggstyper: VedleggType[] = ['STUDIER', 'ARBEIDSGIVER', 'OMSORG', 'UTLAND', 'ANDREBARN', 'ANNET'];
export const FileUploadV2 = (props: Props) => {
  const { addError, deleteError, setErrorSummaryFocus } = props;
  const [files, setFiles] = useState<Vedlegg[]>([]);
  const [valgtDokumenttype, velgDokumenttype] = useState<VedleggType | undefined>();
  const [harLastetOppEttersending, setHarLastetOppEttersending] = useState<boolean>(false);
  const [harEttersendingError, setHarEttersendingError] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const { formatMessage } = useIntl();
  const harValgtDokumenttype = !!(valgtDokumenttype && vedleggstyper.includes(valgtDokumenttype));
  const harFeilmeldinger = files.some((file) => file.errorMessage);
  const visSendInnKnapp = files.length > 0 && harValgtDokumenttype;

  const onClick = async () => {
    setIsUploading(true);
    if (harFeilmeldinger) {
      setErrorSummaryFocus();
      setIsUploading(false);
      return;
    }

    const ettersendelse: Ettersendelse = {
      // ...(søknadId && { søknadId: søknadId }),
      totalFileSize: files.reduce((acc, curr) => acc + curr.size, 0),
      ettersendteVedlegg: [
        {
          vedleggType: valgtDokumenttype!, // TODO sjekk om dette kan gjøres på en bedre måte
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
      } else {
        setHarEttersendingError(true);
      }
    } catch (err) {
      console.log(err);
      setHarEttersendingError(true);
    }
    setIsUploading(false);
  };

  const onUpload = (vedlegg: Vedlegg[]) => {
    if (harLastetOppEttersending) {
      setHarLastetOppEttersending(false);
    }
    const errors = findErrors(vedlegg, valgtDokumenttype ?? 'generisk');
    errors && addError(errors);
    setFiles([...files, ...vedlegg]);
  };

  const onDelete = (vedlegg: Vedlegg) => {
    if (vedlegg.errorMessage) {
      deleteError(vedlegg);
    }

    const newFiles = files.filter((file) => file.vedleggId !== vedlegg.vedleggId);
    setFiles(newFiles);
  };

  const vedleggOptions: { label: string; value: VedleggType | undefined }[] = vedleggstyper.map((vedleggstype) => ({
    label: formatMessage({ id: `ettersendelse.vedleggstyper.${vedleggstype}.heading` }),
    value: vedleggstype,
  }));

  vedleggOptions.unshift({
    label: 'Velg dokumenttype',
    value: undefined,
  });

  return (
    <Section>
      <div className={styles.fileinput_container}>
        <div className={styles.fileInput}>
          <Heading size={'medium'}>{formatMessage({ id: 'ettersendelse.generisk.heading' })}</Heading>
          <BodyShort>{formatMessage({ id: 'ettersendelse.generisk.description' })}</BodyShort>
          <Select
            label={formatMessage({ id: 'ettersendelse.generisk.dokumenttyper.heading' })}
            onChange={(v) => velgDokumenttype(v.target.value as VedleggType)}
          >
            {vedleggOptions.map((vedleggtype) => (
              <option key={vedleggtype.label} value={vedleggtype.value}>
                {vedleggtype.label}
              </option>
            ))}
          </Select>
          {harValgtDokumenttype && (
            <>
              <Alert variant={'info'}>
                {formatMessage({ id: `ettersendelse.vedleggstyper.${valgtDokumenttype}.description` })}
              </Alert>
              <FileInputMinimal
                files={files}
                id={'wat'}
                onUpload={onUpload}
                onDelete={onDelete}
                deleteUrl={'/aap/mine-aap/api/vedlegginnsending/slett/?uuid='}
                uploadUrl={'/aap/mine-aap/api/vedlegginnsending/lagre/'}
                readAttachmentUrl={'/aap/mine-aap/vedlegg/'}
              />
            </>
          )}
        </div>
        {harLastetOppEttersending && (
          <div className={styles.successWrapper}>
            <Alert variant="success">
              <BodyShort>Takk! Dokumentasjonen er nå sendt inn!</BodyShort>
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
      </div>
    </Section>
  );
};
