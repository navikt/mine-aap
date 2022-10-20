import { Alert, BodyShort, Button, Heading } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import { useForm, useFieldArray, FieldArrayWithId, FieldErrors } from 'react-hook-form';
import { useFeatureToggleIntl } from 'lib/hooks/useFeatureToggleIntl';
import { Ettersendelse, OpplastetVedlegg, VedleggType } from 'lib/types/types';
import { Section } from 'components/Section/Section';
import { FileInput, validateFile } from 'components/Inputs/FileInput';
import * as styles from 'components/Inputs/FileUpload.module.css';
import { FileUploadFields } from 'components/Inputs/FileUploadFields';

const MAX_TOTAL_FILE_SIZE = 1024 * 1024 * 150; // 150 MB
export const TOTAL_FILE_SIZE = 'totalFileSize';

export const bytesToMB = (bytes: number) => (bytes / (1024 * 1024)).toPrecision(2);

export const getFileExtension = (fileName: string) => {
  const parts = fileName.split('.');
  if (parts.length > 0) {
    return parts[parts.length - 1];
  }
  return fileName;
};

const getErrorKeyForStatusCode = (statusCode: number, substatus?: string) => {
  if (statusCode === 413) return 'storrelse';
  if (statusCode === 422) return substatus?.toLowerCase() || 'virus';
  return 'feilet';
};
interface Props {
  søknadId?: string;
  krav: VedleggType;
  updateErrorSummary: (errors: FieldErrors, krav: string) => void;
  setErrorSummaryFocus: () => void;
  onEttersendSuccess: (krav: VedleggType) => void;
}

export interface VedleggFormValues {
  [key: string]: { fields: OpplastetVedlegg[]; totalFileSize: number };
}

export const FileUpload = ({
  søknadId,
  krav,
  updateErrorSummary,
  setErrorSummaryFocus,
  onEttersendSuccess,
}: Props) => {
  const { formatMessage } = useFeatureToggleIntl();

  const [uploadFinished, setUploadFinished] = useState(false);
  const [hasEttersendingError, setHasEttersendingError] = useState(false);
  const [isSendingEttersendelse, setIsSendingEttersendelse] = useState(false);

  const { control, handleSubmit, setError, setValue, clearErrors, formState } =
    useForm<VedleggFormValues>();

  const { append, update, remove, fields } = useFieldArray({
    name: `${krav as string}.fields`,
    control,
  });

  useEffect(() => {
    const iterateOverFiles = async (fields: FieldArrayWithId<VedleggFormValues>[]) => {
      if (fields.length > 0) {
        setUploadFinished(false);
      }

      clearErrors(`${krav}.${TOTAL_FILE_SIZE}`);
      const totalSize = fields.reduce((acc, curr) => acc + curr.size, 0);
      setValue(`${krav as string}.${TOTAL_FILE_SIZE}`, totalSize);
      if (totalSize > MAX_TOTAL_FILE_SIZE) {
        setError(`${krav}.${TOTAL_FILE_SIZE}`, {
          type: 'custom',
          message: formatMessage('validation.totalStorrelse', {
            size: bytesToMB(MAX_TOTAL_FILE_SIZE).toString(),
            filesSize: bytesToMB(totalSize).toString(),
          }),
        });
      }
      for await (const [index, field] of fields.entries()) {
        await validateAndUploadFile(field, index);
      }
    };

    const validateAndUploadFile = async (
      field: FieldArrayWithId<VedleggFormValues>,
      index: number
    ) => {
      if (field.vedleggId || !field.isUploading) {
        return;
      }

      const validationResult = validateFile(field.file);
      if (validationResult) {
        setError(`${krav}.fields.${index}`, {
          type: 'custom',
          message: formatMessage('validation.filtype', {
            type: `.${getFileExtension(field.file.name)}`,
          }),
        });
        update(index, { ...field, isUploading: false });
        return;
      }
      const data = new FormData();
      data.append('vedlegg', field.file);
      const vedlegg = await fetch('/aap/mine-aap/api/vedlegg/lagre/', {
        method: 'POST',
        body: data,
      });
      const vedleggData = await vedlegg.json();
      if (vedlegg.ok) {
        update(index, { ...field, vedleggId: vedleggData, isUploading: false });
      } else {
        setError(`${krav}.fields.${index}`, {
          type: 'custom',
          // @ts-ignore-line
          message: formatMessage(
            `validation.${getErrorKeyForStatusCode(vedlegg.status, vedleggData?.substatus)}`,
            {
              size: bytesToMB(MAX_TOTAL_FILE_SIZE),
            }
          ),
        });
        update(index, { ...field, isUploading: false });
      }
    };
    iterateOverFiles(fields);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields, update, setError, clearErrors, setValue, krav]);

  useEffect(() => {
    updateErrorSummary(formState.errors, krav);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(formState.errors), krav]); // 👻 - Vi må gjøre en deepCompare på formState.errors for å unngå at errors i parent blir oppdatert feil

  const onSubmit = async (data: VedleggFormValues) => {
    setIsSendingEttersendelse(true);
    setHasEttersendingError(false);
    const ettersendelse: Ettersendelse = {
      ...(søknadId && { søknadId: søknadId }),
      ettersendteVedlegg: [
        {
          vedleggType: krav,
          ettersending:
            data[krav]?.fields
              ?.map((vedlegg: OpplastetVedlegg) => vedlegg.vedleggId)
              .filter((vedlegg): vedlegg is string => !!vedlegg) ?? [],
        },
      ],
    };
    try {
      const response = await fetch('/aap/mine-aap/api/ettersendelse/send/', {
        method: 'POST',
        body: JSON.stringify(ettersendelse),
      });
      if (response.ok) {
        remove();
        setUploadFinished(true);
        onEttersendSuccess(krav);
      } else {
        setHasEttersendingError(true);
      }
    } catch (err) {
      console.log(err);
      setHasEttersendingError(true);
    }
    setIsSendingEttersendelse(false);
  };

  return (
    <Section>
      <form
        onSubmit={handleSubmit(
          (data) => {
            onSubmit(data);
          },
          (error) => {
            setErrorSummaryFocus();
          }
        )}
      >
        <div className={styles.fileUpload}>
          <Heading level="3" size="small" spacing>
            {formatMessage(`ettersendelse.vedleggstyper.${krav}.heading`)}
          </Heading>

          <BodyShort spacing>
            {formatMessage(`ettersendelse.vedleggstyper.${krav}.description`)}
          </BodyShort>
          {hasEttersendingError && (
            <Alert variant="error">
              Beklager, vi har litt rusk i NAVet. Du kan prøve på nytt om et par minutter, eller
              sende inn dokumentasjonen på papir.
            </Alert>
          )}
          {uploadFinished ? (
            <Alert variant="success">
              {krav === 'ANNET' ? (
                <>
                  Takk! Dokumentasjonen er nå sendt inn! Har du flere dokumenter du ønsker å sende,
                  kan du laste de opp under.
                </>
              ) : (
                <>
                  Takk! Dokumentasjonen er nå sendt inn! Har du flere dokumenter du ønsker å sende,
                  kan du laste de opp under &quot;Annen dokumentasjon&quot;.
                </>
              )}
            </Alert>
          ) : (
            <FileUploadFields
              fields={fields}
              krav={krav}
              errors={formState.errors}
              remove={remove}
            />
          )}
          {fields.length > 0 && (
            <div>
              <Button variant="primary" type="submit" loading={isSendingEttersendelse}>
                {formatMessage('ettersendelse.buttons.primary')}
              </Button>
            </div>
          )}
          {(!uploadFinished || krav === 'ANNET') && <FileInput krav={krav} append={append} />}
        </div>
      </form>
    </Section>
  );
};
