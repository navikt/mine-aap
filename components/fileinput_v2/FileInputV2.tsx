import { Section } from 'components/Section/Section';
import { BodyShort, Heading, Loader, Select } from '@navikt/ds-react';
import React, { useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { VedleggType } from 'lib/types/types';
import { UploadIcon } from '@navikt/aksel-icons';
import { v4 as uuidV4 } from 'uuid';
import { Vedlegg } from 'components/fileinput_v3/FileInputV3';
import { FilePanelError } from 'components/fileinput_v3/FilePanelError';
import { FilePanelSuccess } from 'components/fileinput_v3/FilePanelSuccess';

const MAX_TOTAL_FILE_SIZE = 52428800; // 50mb

const findErrors = (vedlegg: Vedlegg[]) =>
  vedlegg
    .filter((fil) => fil.errorMessage)
    .map((fil) => ({ path: 'generisk', message: fil.errorMessage, id: fil.vedleggId }));

const vedleggstyper: VedleggType[] = ['STUDIER', 'ARBEIDSGIVER', 'OMSORG', 'UTLAND', 'ANDREBARN', 'ANNET'];
export const FileInputV2 = () => {
  const [valgtDokumenttype, velgDokumenttype] = useState<VedleggType | undefined>();
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [files, setFiles] = useState<Vedlegg[]>([]);
  const [harLastetOppEttersending, setHarLastetOppEttersending] = useState<boolean>(false);

  const fileInputElement = useRef<HTMLInputElement>(null);
  const inputId = useMemo(() => uuidV4(), []);
  const { formatMessage } = useIntl();
  const harValgtDokumenttype = valgtDokumenttype && vedleggstyper.includes(valgtDokumenttype);

  function feilmeldingForSubstatus(substatus: string) {
    switch (substatus) {
      case 'PASSWORD_PROTECTED':
        return formatMessage({ id: 'tekster.fileInputErrors.passordbeskyttet' });
      case 'VIRUS':
        return formatMessage({ id: 'tekster.fileInputErrors.virus' });
      case 'SIZE':
        return formatMessage({ id: 'tekster.fileInputErrors.size' });
      default:
        return '';
    }
  }

  const settFeilmelding = (statusCode: number, substatus = '') => {
    switch (statusCode) {
      case 422:
        return feilmeldingForSubstatus(substatus);
      case 413:
        return formatMessage({ id: 'tekster.fileInputErrors.fileTooLarge' });
      case 415:
        return formatMessage({ id: 'tekster.fileInputErrors.unsupportedMediaType' });
      default:
        return formatMessage({ id: 'tekster.fileInputErrors.other' });
    }
  };

  function internalValidate(fileToUpload: File): string | undefined {
    const totalUploadedSize = files.reduce((acc, curr) => acc + curr.size, 0);

    if (!['image/png', 'image/jpg', 'image/jpeg', 'application/pdf'].includes(fileToUpload?.type)) {
      return formatMessage({ id: 'tekster.fileInputErrors.unsupportedMediaType' });
    }

    if (totalUploadedSize + fileToUpload?.size > MAX_TOTAL_FILE_SIZE) {
      return formatMessage({ id: 'tekster.fileInputErrors.fileTooLarge' });
    }
  }

  const onUpload = (vedlegg: Vedlegg[]) => {
    if (harLastetOppEttersending) {
      setHarLastetOppEttersending(false);
    }
    const errors = findErrors(vedlegg);
    // errors && addError(errors); TODO legg inn feilyu
    setFiles([...files, ...vedlegg]);
  };

  const onDelete = (vedlegg: Vedlegg) => {
    if (vedlegg.errorMessage) {
      // deleteError(vedlegg); TODO slett feilmelding
    }

    const newFiles = files.filter((file) => file.vedleggId !== vedlegg.vedleggId);
    setFiles(newFiles);
  };

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
            const res = await fetch('/aap/mine-aap/api/vedlegginnsending/lagre/', { method: 'POST', body: data });
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

  const vedleggOptions: { label: string; value: VedleggType | undefined }[] = vedleggstyper.map((vedleggstype) => ({
    label: formatMessage({ id: `ettersendelse.vedleggstyper.${vedleggstype}.heading` }),
    value: vedleggstype,
  }));

  vedleggOptions.unshift({
    label: 'Velg dokumenttype',
    value: undefined,
  });

  console.log(valgtDokumenttype);
  return (
    <Section>
      <div className={'fileInput'}>
        <Heading size={'medium'}>{formatMessage({ id: 'ettersendelse.generisk.heading' })}</Heading>
        <BodyShort>{formatMessage({ id: 'ettersendelse.generisk.description' })}</BodyShort>
        <Select label={'Hva inneholder dokumentet?'} onChange={(v) => velgDokumenttype(v.target.value as VedleggType)}>
          {vedleggOptions.map((vedleggOption) => (
            <option value={vedleggOption.value} key={vedleggOption.label}>
              {vedleggOption.label}
            </option>
          ))}
        </Select>
        {harValgtDokumenttype && (
          <div>
            <div>{formatMessage({ id: `ettersendelse.vedleggstyper.${valgtDokumenttype}.description` })}</div>
            <br /> {/* TODO hack hack */}
            {files?.map((file) => {
              if (file.errorMessage) {
                return <FilePanelError file={file} key={file.vedleggId} onDelete={() => onDelete(file)} />;
              } else {
                return (
                  <FilePanelSuccess
                    file={file}
                    key={file.vedleggId}
                    deleteUrl={'/aap/mine-aap/api/vedlegginnsending/slett/?uuid='}
                    readAttachmentUrl={'/aap/mine-aap/vedlegg'}
                    onDelete={() => {
                      onDelete(file);
                    }}
                  />
                );
              }
            })}
            <div
              data-testid={'dropzone'}
              className={`dropzone ${dragOver ? 'dragover' : ''}`}
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
                    className={'visuallyHidden'}
                    tabIndex={-1}
                    data-testid={'fileinput'}
                    multiple={true}
                    accept="image/*,.pdf"
                    ref={fileInputElement}
                  />
                  <BodyShort>{'Dra og slipp'}</BodyShort>
                  <BodyShort>{'eller'}</BodyShort>
                  <label htmlFor={inputId}>
                    <span
                      className={
                        'fileInputButton navds-button navds-button__inner navds-body-short navds-button--secondary'
                      }
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
                      Velg filer
                    </span>
                  </label>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </Section>
  );
};
