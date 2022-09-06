import { Alert, BodyShort, Button, Heading } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import { useForm, useFieldArray, FieldArrayWithId, ErrorOption } from 'react-hook-form';
import { useFeatureToggleIntl } from 'lib/hooks/useFeatureToggleIntl';
import { Ettersendelse, OpplastetVedlegg, VedleggType } from 'lib/types/types';
import { Section } from 'components/Section/Section';
import { fileErrorTexts, FileInput, validateFile } from 'components/Inputs/FileInput';
import * as styles from 'components/Inputs/FileUpload.module.css';
import { FileUploadFields } from 'components/Inputs/FileUploadFields';
import { FormErrorSummary } from 'components/FormErrorSummary/FormErrorSummary';

const MAX_TOTAL_FILE_SIZE = 1024 * 1024 * 150; // 150 MB
export const TOTAL_FILE_SIZE = 'totalFileSize';

interface Props {
  søknadId: string;
  krav: VedleggType;
}

export interface VedleggFormValues {
  [key: string]: { fields: OpplastetVedlegg[]; totalFileSize: number };
}

export const FileUpload = ({ søknadId, krav }: Props) => {
  const { formatMessage } = useFeatureToggleIntl();

  const [uploadFinished, setUploadFinished] = useState(false);

  const {
    control,
    handleSubmit,
    setError,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<VedleggFormValues>();

  const { append, update, remove, fields } = useFieldArray({
    name: `${krav as string}.fields`,
    control,
  });

  console.log('errors', errors);

  useEffect(() => {
    const iterateOverFiles = async (fields: FieldArrayWithId<VedleggFormValues>[]) => {
      if (fields.length > 0) {
        setUploadFinished(false);
      }
      clearErrors();
      const totalSize = fields.reduce((acc, curr) => acc + curr.size, 0);
      setValue(`${krav as string}.${TOTAL_FILE_SIZE}`, totalSize);
      if (totalSize > MAX_TOTAL_FILE_SIZE) {
        setError(`${krav}.${TOTAL_FILE_SIZE}`, {
          type: 'custom',
          message: 'fileUpload.error.maxSize',
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
      if (field.vedleggId) {
        return;
      }
      const validationResult = validateFile(field.file);
      if (validationResult) {
        setError(`${krav}.fields.${index}`, {
          type: 'custom',
          message: `${fileErrorTexts[validationResult]}`,
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
          message: `${field.name} ${fileErrorTexts[vedlegg.status.toString()]}`,
        });
        return;
      }
    };
    iterateOverFiles(fields);
  }, [fields, update, setError, clearErrors]);

  const onSubmit = (data: VedleggFormValues) => {
    const ettersendelse: Ettersendelse = {
      søknadId: søknadId,
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
            console.log(data);
            onSubmit(data);
          },
          (error) => {
            //setErrorSummaryFocus();
          }
        )}
      >
        <div className={styles.fileUpload}>
          <FormErrorSummary id={`error-summary-${krav}`} errors={errors} />
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
            <FileUploadFields fields={fields} krav={krav} errors={errors} remove={remove} />
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
