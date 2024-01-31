import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

const Vedlegg = () => {
  const [file, setFile] = useState<Blob | undefined>(undefined);
  const params = useParams<{ uuid: string }>();

  useEffect(() => {
    const getFile = async () => {
      const [fileFromSoknadApi, fileFromInnsending] = await Promise.all([
        fetch(`/aap/mine-aap/api/vedlegg/les/?uuid=${params.uuid}`)
          .then((res) => res.blob())
          .catch(() => undefined),
        fetch(`/aap/mine-aap/api/vedlegginnsending/les/?uuid=${params.uuid}`).then((res) =>
          res.blob().catch(() => undefined)
        ),
      ]);

      if (fileFromInnsending) {
        setFile(fileFromInnsending);
      } else if (fileFromSoknadApi) {
        setFile(fileFromSoknadApi);
      }
    };

    getFile();
  }, [params]);

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

export default Vedlegg;
