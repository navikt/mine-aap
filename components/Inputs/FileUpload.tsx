import { Alert, BodyShort, Button, Heading } from '@navikt/ds-react';
import { useCallback, useEffect, useState } from 'react';
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

const getErrorKeyForStatusCode = (statusCode: number) => {
  if (statusCode === 413) return 'storrelse';
  if (statusCode === 422) return 'virus';
  return 'feilet';
};
interface Props {
  søknadId?: string;
  krav: VedleggType;
  updateErrorSummary: (errors: FieldErrors, krav: string) => void;
  setErrorSummaryFocus: () => void;
}

export interface VedleggFormValues {
  [key: string]: { fields: OpplastetVedlegg[]; totalFileSize: number };
}

export const FileUpload = ({ søknadId, krav, updateErrorSummary, setErrorSummaryFocus }: Props) => {
  const { formatMessage } = useFeatureToggleIntl();

  const [uploadFinished, setUploadFinished] = useState(false);

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
        return;
      }
      const data = new FormData();
      data.append('vedlegg', field.file);
      const vedlegg = await fetch('/aap/innsyn/api/vedlegg/lagre/', {
        method: 'POST',
        body: data,
      });
      if (vedlegg.ok) {
        const id = await vedlegg.json();
        update(index, { ...field, vedleggId: id });
      } else {
        setError(`${krav}.fields.${index}`, {
          type: 'custom',
          // @ts-ignore-line
          message: formatMessage(`validation.${getErrorKeyForStatusCode(vedlegg.status)}`, {
            size: bytesToMB(MAX_TOTAL_FILE_SIZE),
          }),
        });
      }
      update(index, { ...field, isUploading: false });
    };
    iterateOverFiles(fields);
  }, [fields, update, setError, clearErrors, setValue, krav]);

  useEffect(() => {
    updateErrorSummary(formState.errors, krav);
  }, [JSON.stringify(formState.errors), krav]); // 👻 - Vi må gjøre en deepCompare på formState.errors for å unngå at errors i parent blir oppdatert feil

  const onSubmit = (data: VedleggFormValues) => {
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
    fetch('/aap/innsyn/api/ettersendelse/send/', {
      method: 'POST',
      body: JSON.stringify(ettersendelse),
    });
    remove();
    setUploadFinished(true);
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
          {uploadFinished ? (
            <Alert variant="success">
              Takk! Dokumentasjonen er nå sendt inn! Har du flere dokumenter du ønsker å sende, kan
              du laste de opp under.
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
              <Button variant="primary" type="submit">
                {formatMessage('ettersendelse.buttons.primary')}
              </Button>
            </div>
          )}
          <FileInput krav={krav} append={append} />
        </div>
      </form>
    </Section>
  );
};
