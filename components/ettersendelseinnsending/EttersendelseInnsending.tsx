'use client';

import type { Vedlegg } from 'components/FileUploadInnsending/FileInputInnsending';
import type { FormError } from 'components/FormErrorSummary/FormErrorSummary';
import { FormErrorSummary } from 'components/FormErrorSummary/FormErrorSummary';
import { FileUpload } from 'components/fileupload/FileUpload';
import type { InnsendingSøknad } from 'lib/types/types';
import { setFocus } from 'lib/utils/dom';
import { useState } from 'react';

interface Props {
  søknad: InnsendingSøknad;
}

export const EttersendelseInnsending = ({ søknad }: Props) => {
  const [errors, setErrors] = useState<FormError[]>([]);

  const errorSummaryId = `form-error-summary-${søknad.innsendingsId ?? 'generic'}`;

  const addError = (errorsFromKrav: FormError[]) => setErrors([...errors, ...errorsFromKrav]);
  const deleteError = (vedlegg: Vedlegg) => setErrors(errors.filter((error) => error.id !== vedlegg.vedleggId));

  return (
    <>
      <FormErrorSummary id={errorSummaryId} errors={errors} />

      <FileUpload
        søknadId={søknad.innsendingsId as string}
        krav="ANNET"
        addError={addError}
        deleteError={deleteError}
        setErrorSummaryFocus={() => setFocus(errorSummaryId)}
        onSuccess={() => {
          //intentional
        }}
      />
    </>
  );
};
