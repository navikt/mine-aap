import { GetServerSidePropsResult, NextPageContext } from 'next';
import { InnsendingSøknad } from 'lib/types/types';
import { getStringFromPossiblyArrayQuery } from '@navikt/aap-felles-utils-client';
import { beskyttetSide } from '@navikt/aap-felles-utils';
import { EttersendelseInnsending } from 'components/ettersendelseinnsending/EttersendelseInnsending';
import { getSøknaderMedEttersendinger } from 'pages/api/soknader/soknadermedettersendinger';

interface PageProps {
  søknadFraInnsending?: InnsendingSøknad;
}

const Index = ({ søknadFraInnsending }: PageProps) => {
  return <>{søknadFraInnsending && <EttersendelseInnsending søknad={søknadFraInnsending} />}</>;
};

export const getServerSideProps = beskyttetSide(async (ctx: NextPageContext): Promise<GetServerSidePropsResult<{}>> => {
  const uuid = getStringFromPossiblyArrayQuery(ctx.query.uuid);

  if (!uuid) {
    return {
      notFound: true,
    };
  }

  const søknaderMedEttersendinger = await getSøknaderMedEttersendinger(ctx.req);

  if (søknaderMedEttersendinger?.length > 0) {
    const søknadFraInnsending = søknaderMedEttersendinger.find((søknad) => søknad.innsendingsId === uuid) ?? null;

    if (!søknadFraInnsending) {
      return {
        notFound: true,
      };
    }

    return {
      props: { søknadFraInnsending },
    };
  }
  return {
    notFound: true,
  };
});

export default Index;
