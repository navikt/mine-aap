'use client';

import {
  type FileObject,
  type FileRejected,
  type FileRejectionReason,
  FileUpload,
  Heading,
  VStack,
} from '@navikt/ds-react';
import { errorHasMessage } from 'lib/utils/error';
import { useTranslations } from 'next-intl';
import { type Dispatch, type SetStateAction, useState } from 'react';
import { v4 as uuidV4 } from 'uuid';

export interface FileWithId {
  file: File;
  vedleggId: string;
  errorMessage: string;
}
const MAX_SIZE_MB = 50;
const MAX_SIZE = MAX_SIZE_MB * 1024 * 1024; // 50mb
const MAX_TOTAL_SIZE = MAX_SIZE_MB * 1024 * 1024; // 50mb

const errors: Record<FileRejectionReason, string> = {
  fileType: 'Filformatet støttes ikke',
  fileSize: `Filen er større enn ${MAX_SIZE_MB} MB`,
};
interface Props {
  uploadedFiles: FileWithId[];
  setUploadedFiles: Dispatch<SetStateAction<FileWithId[]>>;
  setIsError: Dispatch<SetStateAction<boolean>>;
}
export const FileUploadAksel = ({ uploadedFiles, setUploadedFiles, setIsError }: Props) => {
  const t = useTranslations('filopplasting.fileinput');
  function feilmeldingForSubstatus(substatus: string) {
    switch (substatus) {
      case 'PASSWORD_PROTECTED':
        return t('fileInputErrors.passordbeskyttet');
      case 'VIRUS':
        return t('fileInputErrors.virus');
      case 'SIZE':
        return t('fileInputErrors.size');
      default:
        return t('fileInputErrors.default422');
    }
  }

  const settFeilmelding = (statusCode: number, substatus = '') => {
    switch (statusCode) {
      case 422:
        return feilmeldingForSubstatus(substatus);
      case 413:
        return t('fileInputErrors.fileTooLarge');
      case 415:
        return t('fileInputErrors.unsupportedMediaType');
      default:
        return t('fileInputErrors.other');
    }
  };
  const totalUploadedSize = uploadedFiles.reduce((acc, curr) => acc + curr.file.size, 0);
  const [rejectedFiles, setRejectedFiles] = useState<FileRejected[]>([]);

  function removeRejectedFile(fileToRemove: FileObject) {
    const newFileList = rejectedFiles.filter((file) => file !== fileToRemove);
    setRejectedFiles(newFileList);
    setIsError(newFileList.length !== 0);
  }
  function removeUploadedFile(fileToRemove: FileWithId) {
    setUploadedFiles(uploadedFiles.filter((file) => file.vedleggId !== fileToRemove.vedleggId));
  }

  return (
    <VStack gap="space-24">
      <FileUpload.Dropzone
        label="Annen dokumentasjon til din AAP-sak"
        description={`Hvis du har noe annet du ønsker å legge ved til din AAP-sak, kan du laste det opp her. Du kan laste opp PNG-, JPG-, og PDF-filer. Maks total størrelse ${MAX_SIZE_MB} MB.`}
        accept=".png,.jpg,.pdf"
        maxSizeInBytes={MAX_SIZE}
        onSelect={async (newFiles, { accepted }) => {
          const totalSizeNewFiles = accepted.reduce((acc, file) => acc + file.size, 0);
          if (totalSizeNewFiles + totalUploadedSize > MAX_TOTAL_SIZE) {
            setRejectedFiles(
              accepted.map((file) => ({ error: true, file, reasons: ['Total filstørrelse er for stor'] }))
            );
            setIsError(true);
            return;
          }
          const uploadedNewFiles = await Promise.all(
            accepted.map(async (file) => {
              const uploadResult: FileWithId = {
                vedleggId: uuidV4(),
                errorMessage: '',
                file: file,
              };
              const data = new FormData();
              data.append('vedlegg', file);
              try {
                const res = await fetch('/aap/mine-aap/api/vedlegginnsending/lagre/', {
                  method: 'POST',
                  body: data,
                });
                const resData = res.headers.get('content-type')?.includes('application/json') ? await res.json() : {};

                if (res.ok) {
                  uploadResult.vedleggId = resData.filId;
                } else {
                  uploadResult.errorMessage = settFeilmelding(res.status, resData.substatus);
                }
              } catch (err) {
                uploadResult.errorMessage = errorHasMessage(err) ? err.message : 'nettverksfeil';
              }
              return uploadResult;
            })
          );
          setUploadedFiles([...uploadedFiles, ...uploadedNewFiles.filter((f) => !f.errorMessage)]);
          const errorFileObjects = [
            ...newFiles.filter((f) => f.error),
            ...uploadedNewFiles.filter((f) => f.errorMessage).map(mapToFileObject),
          ];
          const allErrors = [...rejectedFiles, ...errorFileObjects];
          setRejectedFiles(allErrors);
          setIsError(allErrors.length !== 0);
        }}
      />
      {uploadedFiles.length > 0 && (
        <VStack gap="space-8">
          <Heading level="3" size="xsmall">
            {`Vedlegg som er klare til innsending (${uploadedFiles.length} filer, totalt ${(totalUploadedSize / (1024 * 1024)).toFixed(2)} MB)`}
          </Heading>
          <VStack as="ul" gap="space-12">
            {uploadedFiles.map((file) => (
              <FileUpload.Item
                as="li"
                key={file.vedleggId}
                file={file.file}
                button={{
                  action: 'delete',
                  onClick: () => removeUploadedFile(file),
                }}
              />
            ))}
          </VStack>
        </VStack>
      )}
      {rejectedFiles.length > 0 && (
        <VStack gap="space-8">
          <Heading level="3" size="xsmall">
            Vedlegg med feil
          </Heading>
          <VStack as="ul" gap="space-12">
            {rejectedFiles.map((rejected) => (
              <FileUpload.Item
                as="li"
                key={rejected.file.name}
                file={rejected.file}
                error={errors[rejected.reasons[0] as FileRejectionReason] || rejected.reasons[0]}
                button={{
                  action: 'delete',
                  onClick: () => removeRejectedFile(rejected),
                }}
              />
            ))}
          </VStack>
        </VStack>
      )}
    </VStack>
  );
};

function mapToFileObject(vedlegg: FileWithId): FileRejected {
  return { error: true, file: vedlegg.file, reasons: [vedlegg.errorMessage] } as FileRejected;
}
