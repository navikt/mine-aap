import { beskyttetSide, getAccessToken } from '@navikt/aap-felles-utils';
import { GetServerSidePropsResult, NextPageContext } from 'next';
import { useEffect, useState } from 'react';
import { getStringFromPossiblyArrayQuery } from '@navikt/aap-felles-utils-client';
import { getSøknaderInnsending } from 'pages/api/soknader/soknader';

interface PageProps {
  uuid: string;
  brukInnsending: boolean;
}

const Vedlegg = ({ uuid, brukInnsending }: PageProps) => {
  const [file, setFile] = useState<Blob | undefined>(undefined);
  const url = brukInnsending
    ? `/aap/mine-aap/api/vedlegginnsending/les/?uuid=${uuid}`
    : `/aap/mine-aap/api/vedlegg/les/?uuid=${uuid}`;

  useEffect(() => {
    const getFile = async () => {
      const file = await fetch(url).then((res) => res.blob());
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
        <iframe title="vedlegg" src={URL.createObjectURL(file)}>
          <p>This browser does not suppoert</p>
        </iframe>
      </object>
    </div>
  );
};

export const getServerSideProps = beskyttetSide(async (ctx: NextPageContext): Promise<GetServerSidePropsResult<{}>> => {
  const bearerToken = getAccessToken(ctx);
  const innsendingSøknader = await getSøknaderInnsending(bearerToken);
  const innsendingSøknad = innsendingSøknader[0];

  const uuid = innsendingSøknad ? innsendingSøknad.innsendingsId : getStringFromPossiblyArrayQuery(ctx.query['uuid']);

  return {
    props: { uuid, brukInnsending: Boolean(innsendingSøknad) },
  };
});

export default Vedlegg;
