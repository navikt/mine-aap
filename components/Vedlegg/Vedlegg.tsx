'use client';

import { useEffect, useState } from 'react';

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
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <object data={URL.createObjectURL(file)}>
        <iframe title="vedlegg" src={URL.createObjectURL(file)}>
          <p>This browser does not suppoert</p>
        </iframe>
      </object>
    </div>
  );
};
