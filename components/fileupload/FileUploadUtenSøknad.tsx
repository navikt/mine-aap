'use client';

import { FileUpload } from 'components/fileupload/FileUpload';
import { Error, FormErrorSummary } from 'components/FormErrorSummary/FormErrorSummary';
import { setFocus } from 'lib/utils/dom';
import { useState } from 'react';
import { Vedlegg } from 'components/FileUploadInnsending/FileInputInnsending';

export const FileUploadUtenSøknad = () => {
  const [errors, setErrors] = useState<Error[]>([]);
  const errorSummaryId = 'errorSummary';

  const addError = (errorsFromKrav: Error[]) => setErrors([...errors, ...errorsFromKrav]);
  const deleteError = (vedlegg: Vedlegg) => setErrors(errors.filter((error) => error.id !== vedlegg.vedleggId));
  return (
    <>
      <FormErrorSummary id={errorSummaryId} errors={errors} />

      <FileUpload
        krav="ANNET"
        addError={addError}
        deleteError={deleteError}
        setErrorSummaryFocus={() => setFocus(errorSummaryId)}
        onSuccess={() => {}}
      />
    </>
  );
};
