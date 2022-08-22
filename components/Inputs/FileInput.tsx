import { Cancel, Delete, FileError, FileSuccess, Upload as SvgUpload } from '@navikt/ds-icons';
import { BodyShort, Button, Detail, Heading, Label, Link, Panel } from '@navikt/ds-react';
import { DragEventHandler, useEffect, useRef, useState } from 'react';
import {
  useFieldArray,
  Control,
  FieldErrors,
  UseFormSetError,
  UseFormClearErrors,
  FieldArrayWithId,
} from 'react-hook-form';
import { useFeatureToggleIntl } from '../../hooks/useFeatureToggleIntl';
import { FormValues } from '../../pages/ettersendelse';
import * as styles from './FileInput.module.css';

const fileSizeString = (size: number) => {
  const kb = size / 1024;
  return kb > 1000 ? `${(kb / 1024).toFixed(1)} mB` : `${Math.floor(kb)} kB`;
};

const replaceDotWithUnderscore = (str: string) => str.replace(/\./g, '_');

export const validFileTypes = ['image/png', 'image/jpg', 'image/jpeg', 'application/pdf'];

export const fileErrorTexts = {
  413: 'Filen er for stor',
  415: 'Filen er ikke gyldig',
  422: 'Inneholder virus',
  500: 'Det oppstod en feil',
};

export const validateFile = (file: File) => {
  if (!validFileTypes.includes(file.type)) {
    return 415;
  }
};

interface Props {
  heading?: string;
  description?: string;
  name: 'FORELDER' | 'FOSTERFORELDER' | 'STUDIESTED' | 'ANNET';
  control: Control<FormValues>;
  setError: UseFormSetError<FormValues>;
  clearErrors: UseFormClearErrors<FormValues>;
  errors?: FieldErrors<FormValues>;
}

export const FileInput = ({
  heading,
  description,
  name,
  control,
  setError,
  clearErrors,
  errors,
}: Props) => {
  const { formatMessage } = useFeatureToggleIntl();

  const [inputId] = useState<string>(`file-upload-input-${Math.floor(Math.random() * 100000)}`);

  const [dragOver, setDragOver] = useState<boolean>(false);

  const { append, update, remove, fields } = useFieldArray({
    name: name,
    control,
  });

  useEffect(() => {
    const iterateOverFiles = async (fields: FieldArrayWithId<FormValues>[]) => {
      for await (const [index, field] of fields.entries()) {
        await validateAndUploadFile(field, index);
      }
    };

    const validateAndUploadFile = async (field: FieldArrayWithId<FormValues>, index: number) => {
      if (field.vedleggId) {
        return;
      }
      const validationResult = validateFile(field.file);
      if (validationResult) {
        setError(`${name}.${index}`, {
          type: 'custom',
          message: `${field.name} ${fileErrorTexts[validationResult]}`,
        });
        return;
      }
      const data = new FormData();
      data.append('vedlegg', field.file);
      const vedlegg = await fetch('/aap/innsyn/api/ettersendelse/lagre/', {
        method: 'POST',
        body: data,
      });
      if (vedlegg.ok) {
        const id = await vedlegg.json();
        update(index, { ...field, vedleggId: id });
      } else {
        setError(`${name}.${index}`, {
          type: 'custom',
          // @ts-ignore-line
          message: `${field.name} ${fileErrorTexts[vedlegg.status.toString()]}`,
        });
        return;
      }
    };
    iterateOverFiles(fields);
  }, [fields, name, update, setError]);

  const fileUploadInputElement = useRef<HTMLInputElement>(null);

  const handleDragLeave: DragEventHandler<HTMLDivElement> = (e) => {
    setDragOver(false);
    return e;
  };
  const handleDragEnter: DragEventHandler<HTMLDivElement> = (e) => {
    setDragOver(true);
    return e;
  };
  const handleDragOver: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
  };
  const handleDrop: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    addFiles(files);
  };

  const addFiles = async (files: FileList | null) => {
    setDragOver(false);
    Array.from(files || []).forEach((file) => {
      append({
        name: file.name,
        size: file.size,
        file: file,
      });
    });
  };

  return (
    <div className={styles.fileInput}>
      {heading && (
        <Heading level="3" size="small" spacing>
          {heading}
        </Heading>
      )}
      {description && <BodyShort spacing>{description}</BodyShort>}

      {fields.map((attachment, index) => {
        const fieldHasError = errors?.[name]?.[index]?.message !== undefined;
        return (
          <div key={attachment.id}>
            <Panel
              className={`${styles.fileCard} ${fieldHasError ?? styles?.error}`}
              key={attachment.id}
            >
              <div className={styles.fileCardLeftContent}>
                {fieldHasError ? (
                  <>
                    <div className={styles?.fileError}>
                      <FileError color={'var(--navds-semantic-color-interaction-danger-hover)'} />
                    </div>
                    <div>
                      <Label id={`${name}.${index}`}>{attachment.name}</Label>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={styles?.fileSuccess}>
                      <FileSuccess color={'var(--navds-semantic-color-feedback-success-icon)'} />
                    </div>
                    <div>
                      <Link
                        target={'_blank'}
                        href={`/aap/innsyn/vedleggvisning/${attachment?.vedleggId}`}
                      >
                        {attachment?.name}
                      </Link>
                      <Detail>{fileSizeString(attachment?.size)}</Detail>
                    </div>
                  </>
                )}
              </div>
              {fieldHasError ? (
                <button
                  type={'button'}
                  onClick={() => {
                    remove(index);
                  }}
                  tabIndex={0}
                  onKeyPress={(event) => {
                    if (event.key === 'Enter') {
                      remove(index);
                    }
                  }}
                  className={styles?.deleteAttachment}
                >
                  <Cancel title={formatMessage('filopplasting.vedlegg.avbryt')} />
                  <BodyShort>{formatMessage('filopplasting.vedlegg.avbryt')}</BodyShort>
                </button>
              ) : (
                <button
                  type={'button'}
                  onClick={() =>
                    fetch(`/aap/innsyn/api/ettersendelse/slett/?uuid=${attachment?.vedleggId}`, {
                      method: 'DELETE',
                    }).then(() => remove(index))
                  }
                  tabIndex={0}
                  onKeyPress={(event) => {
                    if (event.key === 'Enter') {
                      remove(index);
                    }
                  }}
                  className={styles?.deleteAttachment}
                >
                  <Delete title={formatMessage('filopplasting.vedlegg.slett')} />
                  <BodyShort>{formatMessage('filopplasting.vedlegg.slett')}</BodyShort>
                </button>
              )}
            </Panel>
            {fieldHasError && (
              <div className={'navds-error-message navds-error-message--medium navds-label'}>
                {errors?.[name]?.[index]?.message}
              </div>
            )}
          </div>
        );
      })}

      {fields.length > 0 && (
        <div>
          <Button variant="primary" type="submit">
            {formatMessage('ettersendelse.buttons.primary')}
          </Button>
        </div>
      )}

      <div
        className={`${styles.dropZone} ${dragOver ? styles.dragOver : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e)}
      >
        <>
          <input
            id={inputId}
            type="file"
            multiple
            className={styles.visuallyHidden}
            tabIndex={-1}
            ref={fileUploadInputElement}
            onChange={(event) => addFiles(event.target.files)}
            accept="image/*,.pdf"
          />
          <BodyShort>{formatMessage('filopplasting.vedlegg.draOgSlipp')}</BodyShort>
          <BodyShort>{formatMessage('filopplasting.vedlegg.eller')}</BodyShort>
          <label htmlFor={inputId}>
            <span
              /* eslint-disable-next-line max-len */
              className={`${styles?.fileInputButton} navds-button navds-button__inner navds-body-short navds-button--secondary`}
              role={'button'}
              aria-controls={inputId}
              tabIndex={0}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  fileUploadInputElement?.current?.click();
                }
              }}
            >
              <SvgUpload title={formatMessage('filopplasting.vedlegg.lastOppFil')} />
              {formatMessage('filopplasting.vedlegg.velgDineFiler')}
            </span>
          </label>
        </>
      </div>
    </div>
  );
};
