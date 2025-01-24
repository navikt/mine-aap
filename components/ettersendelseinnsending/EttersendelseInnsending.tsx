'use client';

import { InnsendingSøknad } from 'lib/types/types';
import { useState } from 'react';
import { Error, FormErrorSummary } from 'components/FormErrorSummary/FormErrorSummary';
import { Vedlegg } from '@navikt/aap-felles-react';

import { FileUpload } from 'components/fileupload/FileUpload';
import { setFocus } from 'lib/utils/dom';

interface Props {
  søknad: InnsendingSøknad;
}

export const EttersendelseInnsending = ({ søknad }: Props) => {
  const [errors, setErrors] = useState<Error[]>([]);

  const errorSummaryId = `form-error-summary-${søknad.innsendingsId ?? 'generic'}`;

  const addError = (errorsFromKrav: Error[]) => setErrors([...errors, ...errorsFromKrav]);
  const deleteError = (vedlegg: Vedlegg) => setErrors(errors.filter((error) => error.id !== vedlegg.vedleggId));

  return (
    <>
      {/*<Head>
        <title>
          {`${formatMessage(
            { id: 'ettersendelse.appTittel' },
            {
              shy: '',
            }
          )} - nav.no`}
        </title>
      </Head>*/}

      <FormErrorSummary id={errorSummaryId} errors={errors} />

      <FileUpload
        søknadId={søknad.innsendingsId as string}
        krav="ANNET"
        addError={addError}
        deleteError={deleteError}
        setErrorSummaryFocus={() => setFocus(errorSummaryId)}
        onSuccess={() => {}}
      />
    </>
  );
};
