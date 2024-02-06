import { FileInputInnsending, Vedlegg } from '@navikt/aap-felles-react';
import { useIntl } from 'react-intl';
import { Section } from 'components/Section/Section';
import { Button, Select } from '@navikt/ds-react';
import React, { useState } from 'react';
import { Error } from 'components/FormErrorSummary/FormErrorSummary';
import styles from 'components/fileupload/FileUpload.module.css';

type Vedleggstype =
  | 'STUDIER'
  | 'ARBEIDSGIVER'
  | 'OMSORG'
  | 'UTLAND'
  | 'ANDREBARN'
  | 'LÅNEKASSEN_STIPEND'
  | 'LÅNEKASSEN_LÅN'
  | 'UTENLANDSKE'
  | 'ANNET';
const vedleggstyper: Vedleggstype[] = [
  'STUDIER',
  'ARBEIDSGIVER',
  'OMSORG',
  'UTLAND',
  'ANDREBARN',
  'LÅNEKASSEN_STIPEND',
  'LÅNEKASSEN_LÅN',
  'UTENLANDSKE',
  'ANNET',
];

const findErrors = (vedlegg: Vedlegg[]) =>
  vedlegg
    .filter((fil) => fil.errorMessage)
    .map((fil) => ({ path: 'generisk', message: fil.errorMessage, id: fil.vedleggId }));

type Props = {
  addError: (errors: Error[]) => void;
  deleteError: (vedlegg: Vedlegg) => void;
};

export const FileUploadWithCategory = ({ addError, deleteError }: Props) => {
  const { formatMessage } = useIntl();
  const [files, setFiles] = useState<Vedlegg[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const visSendInnKnapp = files.length > 0;

  const onClick = () => {
    setIsUploading(true);
    setIsUploading(false);
  };

  return (
    <Section>
      <Select label={formatMessage({ id: 'ettersendelse.generisk.dokumenttyper.heading' })}>
        {vedleggstyper.map((vedleggstype) => (
          <option key={vedleggstype}>
            {formatMessage({ id: `ettersendelse.vedleggstyper.${vedleggstype}.heading` })}
          </option>
        ))}
      </Select>
      <FileInputInnsending
        heading={formatMessage({ id: 'ettersendelse.generisk.heading' })}
        ingress={formatMessage({ id: 'ettersendelse.generisk.description' })}
        readAttachmentUrl={'/aap/mine-aap/vedlegg'}
        id={'generisk'}
        onUpload={(vedlegg) => {
          const errors = findErrors(vedlegg);
          errors && addError(errors);
          setFiles([...files, ...vedlegg]);
        }}
        onDelete={(vedlegg) => {
          if (vedlegg.errorMessage) {
            deleteError(vedlegg);
          }

          const newFiles = files.filter((fil) => fil.vedleggId !== vedlegg.vedleggId);
          setFiles(newFiles);
        }}
        deleteUrl={'/aap/mine-aap/api/vedlegginnsending/slett/?uuid='}
        uploadUrl={'/aap/mine-aap/api/vedlegginnsending/lagre/'}
        files={files}
      />
      {visSendInnKnapp && (
        <Button onClick={onClick} loading={isUploading} className={styles.sendButton}>
          Send inn
        </Button>
      )}
    </Section>
  );
};
