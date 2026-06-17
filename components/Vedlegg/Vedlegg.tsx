'use client';

import { Loader } from '@navikt/ds-react';
import { Section } from 'components/Section/Section';
import { useEffect, useState } from 'react';
import styles from './Vedlegg.module.css';

interface Props {
  uuid: string;
}

export const Vedlegg = ({ uuid }: Props) => {
  const [file, setFile] = useState<Blob | undefined>(undefined);

  useEffect(() => {
    const getFile = async () => {
      const fileFromInnsending = await fetch(`/aap/mine-aap/api/vedlegginnsending/les/?uuid=${uuid}`)
        .then((res) => {
          if (res.ok) {
            return res.blob();
          }
          return undefined;
        })
        .catch(() => undefined);

      if (fileFromInnsending) {
        setFile(fileFromInnsending);
      }
    };

    getFile();
  }, [uuid]);

  if (file === undefined) {
    return (
      <Section>
        <div className={styles.loader}>
          <Loader size={'3xlarge'} title={'Laster dokument'} />
        </div>
      </Section>
    );
  }

  return (
    <Section>
      <object data={URL.createObjectURL(file)} className={styles.dokumentvisning}>
        <iframe title="vedlegg" src={URL.createObjectURL(file)}>
          <p>This browser does not suppoert</p>
        </iframe>
      </object>
    </Section>
  );
};
