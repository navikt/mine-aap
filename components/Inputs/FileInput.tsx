import { Upload as SvgUpload } from '@navikt/ds-icons';
import { BodyShort } from '@navikt/ds-react';
import { DragEventHandler, useRef, useState } from 'react';
import { FieldArrayWithId, UseFieldArrayAppend } from 'react-hook-form';
import { useFeatureToggleIntl } from 'lib/hooks/useFeatureToggleIntl';
import { VedleggFormValues } from 'components/Inputs/FileUpload';
import * as styles from 'components/Inputs/FileInput.module.css';
import { VedleggType } from 'lib/types/types';

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
  krav: VedleggType;
  append: UseFieldArrayAppend<VedleggFormValues>;
}

export const FileInput = ({ krav, append }: Props) => {
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
