'use client';

import { Alert, BodyShort, Button, Heading, VStack } from '@navikt/ds-react';
import { FileUploadAksel, type FileWithId } from 'components/fileuploadaksel/FileUploadAksel';
import type { Ettersendelse } from 'lib/types/types';
import { useState } from 'react';

export const EttersendingMedFileUploadAksel = ({ søknadId }: { søknadId: string | null }) => {
  const [isError, setIsError] = useState<boolean>(true);
  const [uploadedFiles, setUploadedFiles] = useState<FileWithId[]>([]);
  const [harLastetOppEttersending, setHarLastetOppEttersending] = useState<boolean>(false);
  const lastetOppEttersendingOgIngenUsendte = harLastetOppEttersending && uploadedFiles.length === 0;
  const [harEttersendingError, setHarEttersendingError] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const visSendInnKnapp = !lastetOppEttersendingOgIngenUsendte && uploadedFiles.length > 0 && !isError;

  const onSendInnClick = async () => {
    setIsUploading(true);

    const ettersendelse: Ettersendelse = {
      ...(søknadId && { søknadId: søknadId }),
      totalFileSize: uploadedFiles.reduce((acc, curr) => acc + curr.file.size, 0),
      ettersendteVedlegg: [
        {
          vedleggType: 'ANNET',
          ettersending: uploadedFiles.map((file) => file.vedleggId),
        },
      ],
    };

    const url = '/aap/mine-aap/api/ettersendelseinnsending/send/';

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(ettersendelse),
      });
      if (response.ok) {
        setUploadedFiles([]);
        setHarLastetOppEttersending(true);
      } else {
        setHarEttersendingError(true);
      }
    } catch (_) {
      setHarEttersendingError(true);
    }
    setIsUploading(false);
  };
  return (
    <VStack gap={'4'}>
      <FileUploadAksel uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} setIsError={setIsError} />
      {lastetOppEttersendingOgIngenUsendte && (
        <Alert variant="success">
          <BodyShort>
            Takk! Dokumentasjonen er nå sendt inn! Har du flere dokumenter du ønsker å sende, kan du laste de opp over.
          </BodyShort>
        </Alert>
      )}
      {harEttersendingError && (
        <Alert variant="error">
          Beklager, vi har litt rusk i Navet. Du kan prøve på nytt om et par minutter, eller sende inn dokumentasjonen
          på papir.
        </Alert>
      )}
      {visSendInnKnapp && (
        <Button onClick={onSendInnClick} loading={isUploading}>
          Send inn
        </Button>
      )}
    </VStack>
  );
};
