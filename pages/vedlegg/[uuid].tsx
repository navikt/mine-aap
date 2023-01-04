import { beskyttetSide } from '@navikt/aap-felles-innbygger-utils';
import { GetServerSidePropsResult, NextPageContext } from 'next';
import { useEffect, useState } from 'react';
import { getStringFromPossiblyArrayQuery } from '@navikt/aap-felles-utils-client';

interface PageProps {
  uuid: string;
}

const Vedlegg = ({ uuid }: PageProps) => {
  const [file, setFile] = useState<Blob | undefined>(undefined);

  useEffect(() => {
    const getFile = async () => {
      const file = await fetch(`/aap/mine-aap/api/vedlegg/les/?uuid=${uuid}`).then((res) =>
        res.blob()
      );
      file && setFile(file);
    };
    getFile();
  }, [uuid]);

  if (file === undefined) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <object data={URL.createObjectURL(file)}>
        <iframe src={URL.createObjectURL(file)}>
          <p>This browser does not suppoert</p>
        </iframe>
      </object>
    </div>
  );
};

export const getServerSideProps = beskyttetSide(
  async (ctx: NextPageContext): Promise<GetServerSidePropsResult<{}>> => {
    const uuid = getStringFromPossiblyArrayQuery(ctx.query['uuid']);
    return {
      props: { uuid },
    };
  }
);

export default Vedlegg;
