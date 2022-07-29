import { Cancel, Delete, FileError, FileSuccess, Upload as SvgUpload } from '@navikt/ds-icons';
import { BodyShort, Detail, Heading, Label, Link, Panel } from '@navikt/ds-react';
import { randomUUID } from 'crypto';
import { DragEventHandler, useRef, useState } from 'react';
import {
  FieldValues,
  useFieldArray,
  Control,
  FieldErrors,
  UseFormSetError,
  UseFormClearErrors,
} from 'react-hook-form';
import { useFeatureToggleIntl } from '../../hooks/useFeatureToggleIntl';
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
  name: string;
  control: Control<FieldValues, any>;
  setError: UseFormSetError<FieldValues>;
  clearErrors: UseFormClearErrors<FieldValues>;
  errors?: FieldErrors<FieldValues>;
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
  const [filesWithErrors, setFilesWithErrors] = useState<File[]>([]);

  const [dragOver, setDragOver] = useState<boolean>(false);

  const { append, remove, fields } = useFieldArray({
    name: name,
    control,
  });

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
    uploadFiles(files);
  };

  const uploadFiles = async (files: FileList | null) => {
    console.log('files', files);

    // TODO: Upload files

    const errorFiles: File[] = [];

    Array.from(files || []).forEach((file, index) => {
      setDragOver(false);
      const validationResult = validateFile(file);
      if (validationResult) {
        setError(`${name}.${replaceDotWithUnderscore(file.name)}`, {
          type: 'custon',
          message: `${file.name} ${fileErrorTexts[validationResult]}`,
        });
        errorFiles.push(file);
      } else {
        append({
          name: file.name,
          size: file.size,
          vedleggId: randomUUID,
        });
      }
      setFilesWithErrors(errorFiles);
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

      {fields.map((attachment, index) => (
        <Panel className={styles.fileCard} key={attachment.id}>
          <div className={styles.fileCardLeftContent}>
            <div className={styles?.fileSuccess}>
              <FileSuccess color={'var(--navds-semantic-color-feedback-success-icon)'} />
            </div>
            <div>
              <Link target={'_blank'} href={`/aap/innsyn/vedleggvisning/${attachment?.vedleggId}`}>
                {attachment?.name}
              </Link>
              <Detail>{fileSizeString(attachment?.size)}</Detail>
            </div>
          </div>
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
        </Panel>
      ))}

      {filesWithErrors.map((file) => (
        <>
          <Panel className={`${styles?.fileCard} ${styles?.error}`} id={name} tabIndex={0}>
            <div className={styles?.fileCardLeftContent}>
              <div className={styles?.fileError}>
                <FileError color={'var(--navds-semantic-color-interaction-danger-hover)'} />
              </div>
              <div>
                <Label>{file.name}</Label>
              </div>
            </div>
            <button
              type={'button'}
              onClick={() => {
                clearErrors(`${name}.${replaceDotWithUnderscore(file.name)}`);
                setFilesWithErrors(filesWithErrors.filter((f) => f !== file));
              }}
              tabIndex={0}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  clearErrors(`${name}.${replaceDotWithUnderscore(file.name)}`);
                  setFilesWithErrors(filesWithErrors.filter((f) => f !== file));
                }
              }}
              className={styles?.deleteAttachment}
            >
              <Cancel title={formatMessage('filopplasting.vedlegg.avbryt')} />
              <BodyShort>{formatMessage('filopplasting.vedlegg.avbryt')}</BodyShort>
            </button>
          </Panel>
          <div className={'navds-error-message navds-error-message--medium navds-label'}>
            {errors?.[name]?.[replaceDotWithUnderscore(file.name)]?.message as unknown as string}
          </div>
        </>
      ))}

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
            onChange={(event) => uploadFiles(event.target.files)}
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
