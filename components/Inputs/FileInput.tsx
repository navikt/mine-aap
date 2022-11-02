import { Upload as SvgUpload } from '@navikt/ds-icons';
import { BodyShort } from '@navikt/ds-react';
import React, { DragEventHandler, useRef, useState } from 'react';
import { UseFieldArrayAppend } from 'react-hook-form';
import { useFeatureToggleIntl } from 'lib/hooks/useFeatureToggleIntl';
import { VedleggFormValues } from 'components/Inputs/FileUpload';
import * as styles from 'components/Inputs/FileInput.module.css';
import { VedleggType } from 'lib/types/types';

export const validFileTypes = ['image/png', 'image/jpg', 'image/jpeg', 'application/pdf'];

export const validateFile = (file: File) => {
  if (!validFileTypes.includes(file.type)) {
    return 'filtype';
  }
};

interface Props {
  krav: VedleggType;
  append: UseFieldArrayAppend<VedleggFormValues>;
  setShowMultipleFilesInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

export const FileInput = ({ krav, append, setShowMultipleFilesInfo }: Props) => {
  const { formatMessage } = useFeatureToggleIntl();

  const [inputId] = useState<string>(`file-upload-input-${krav}`);

  const [dragOver, setDragOver] = useState<boolean>(false);

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
    setShowMultipleFilesInfo(false);
    setDragOver(false);
    // Deaktiver multiple fileupload
    // Array.from(files || []).forEach((file) => {
    //   append({
    //     name: file.name,
    //     size: file.size,
    //     file: file,
    //     isUploading: true,
    //   });
    // });
    const fileArray = Array.from(files || []);
    if (fileArray.length > 1) {
      setShowMultipleFilesInfo(true);
    }
    const firstFile = fileArray.find((e) => e);
    if (firstFile) {
      append({
        name: firstFile.name,
        size: firstFile.size,
        file: firstFile,
        isUploading: true,
      });
    }
  };

  const resetInputValue = (event: any) => {
    event.target.value = '';
  };

  return (
    <div
      className={`${styles.dropZone} ${dragOver ? styles.dragOver : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e)}
    >
      <input
        id={inputId}
        type="file"
        className={styles.visuallyHidden}
        tabIndex={-1}
        ref={fileUploadInputElement}
        onChange={(event) => addFiles(event.target.files)}
        onClick={(event) => resetInputValue(event)}
        accept="image/*,.pdf"
      />
      <BodyShort>{formatMessage('filopplasting.vedlegg.draOgSlipp')}</BodyShort>
      <BodyShort>{formatMessage('filopplasting.vedlegg.eller')}</BodyShort>
      <label htmlFor={inputId}>
        <span
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
    </div>
  );
};
