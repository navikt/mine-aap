import React, { useMemo, useRef, useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import { useIntl } from 'react-intl';
import { UploadIcon } from '@navikt/aksel-icons';
import { BodyShort, Loader } from '@navikt/ds-react';

import { FilePanelError } from 'components/fileupload_v2/FilePanelError';
import { FilePanelSuccess } from 'components/fileupload_v2/FileInputSuccess';
import styles from 'components/fileupload_v2/FileInputMinimal.module.css';

const MAX_TOTAL_FILE_SIZE = 52428800; // 50mb

export interface Vedlegg {
  vedleggId: string;
  errorMessage?: string;
  size: number;
  name: string;
  type: string;
}
interface FileInputProps {
  files: Vedlegg[];
  id: string;
  onUpload: (attachments: Vedlegg[]) => void;
  onDelete: (attachment: Vedlegg) => void;
  deleteUrl: string;
  uploadUrl: string;
  readAttachmentUrl: string;
}

export const FileInputMinimal = (props: FileInputProps) => {
  const { files, onUpload, onDelete, uploadUrl, deleteUrl, id, readAttachmentUrl = 'nb', ...rest } = props;
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputElement = useRef<HTMLInputElement>(null);
  const inputId = useMemo(() => uuidV4(), []);
  const { formatMessage } = useIntl();

  function feilmeldingForSubstatus(substatus: string) {
    switch (substatus) {
      case 'PASSWORD_PROTECTED':
        return formatMessage({ id: 'fileInputErrors.passordbeskyttet' });
      case 'VIRUS':
        return formatMessage({ id: 'fileInputErrors.virus' });
      case 'SIZE':
        return formatMessage({ id: 'fileInputErrors.size' });
      default:
        return '';
    }
  }

  const settFeilmelding = (statusCode: number, substatus = '') => {
    switch (statusCode) {
      case 422:
        return feilmeldingForSubstatus(substatus);
      case 413:
        return formatMessage({ id: 'fileInputErrors.fileTooLarge' });
      case 415:
        return formatMessage({ id: 'fileInputErrors.unsupportedMediaType' });
      default:
        return formatMessage({ id: 'fileInputErrors.other' });
    }
  };

  function internalValidate(fileToUpload: File): string | undefined {
    const totalUploadedSize = files.reduce((acc, curr) => acc + curr.size, 0);

    if (!['image/png', 'image/jpg', 'image/jpeg', 'application/pdf'].includes(fileToUpload?.type)) {
      return formatMessage({ id: 'fileInputErrors.unsupportedMediaType' });
    }

    if (totalUploadedSize + fileToUpload?.size > MAX_TOTAL_FILE_SIZE) {
      return formatMessage({ id: 'fileInputErrors.fileTooLarge' });
    }
  }

  async function validateAndSetFiles(filelist: FileList) {
    setIsUploading(true);
    const uploadedFiles: Vedlegg[] = await Promise.all(
      Array.from(filelist).map(async (file) => {
        const internalErrorMessage = internalValidate(file);
        let uploadResult: Vedlegg = {
          vedleggId: uuidV4(),
          errorMessage: '',
          type: file.type,
          size: file.size,
          name: file.name,
        };

        if (!internalErrorMessage) {
          try {
            const data = new FormData();
            data.append('vedlegg', file);
            const res = await fetch(uploadUrl, { method: 'POST', body: data });
            const resData = await res.json();

            if (res.ok) {
              uploadResult.vedleggId = resData.filId;
            } else {
              uploadResult.errorMessage = settFeilmelding(res.status, resData.substatus);
            }
          } catch (err: any) {
            uploadResult.errorMessage = settFeilmelding(err?.status || 500);
          }
        } else if (internalErrorMessage) {
          uploadResult.errorMessage = internalErrorMessage;
        }

        return uploadResult;
      })
    );

    setIsUploading(false);
    onUpload(uploadedFiles);
  }

  return (
    <>
      {files?.map((file) => {
        if (file.errorMessage) {
          return <FilePanelError file={file} key={file.vedleggId} onDelete={() => onDelete(file)} />;
        } else {
          return (
            <FilePanelSuccess
              file={file}
              key={file.vedleggId}
              deleteUrl={deleteUrl}
              readAttachmentUrl={readAttachmentUrl}
              onDelete={() => {
                onDelete(file);
              }}
            />
          );
        }
      })}
      <div
        data-testid={'dropzone'}
        className={`${styles.dropzone} ${dragOver ? styles.dragover : ''}`}
        onDragEnter={() => setDragOver(true)}
        onDragLeave={() => setDragOver(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files) {
            validateAndSetFiles(e.dataTransfer.files);
          }
          setDragOver(false);
        }}
      >
        {isUploading ? (
          <Loader title={'Laster'} />
        ) : (
          <>
            <input
              id={inputId}
              type={'file'}
              value={''}
              onChange={(e) => {
                if (e.target.files) {
                  validateAndSetFiles(e.target.files);
                }
              }}
              className={styles.visuallyHidden}
              tabIndex={-1}
              data-testid={'fileinput'}
              multiple={true}
              accept="image/*,.pdf"
              ref={fileInputElement}
              {...rest}
            />
            <BodyShort>{'Dra og slipp'}</BodyShort>
            <BodyShort>{'eller'}</BodyShort>
            <label htmlFor={inputId} aria-labelledby={id}>
              <span
                className={`${styles.fileInputButton} navds-button navds-button__inner navds-body-short navds-button--secondary`}
                role={'button'}
                aria-controls={inputId}
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    fileInputElement?.current?.click();
                  }
                }}
              >
                <UploadIcon title="Last opp filer" aria-hidden />
                Velg filer for dokumentasjon til din AAP-sak
              </span>
            </label>
          </>
        )}
      </div>
    </>
  );
};
