import { GetServerSidePropsResult, NextPageContext } from 'next';
import { InnsendingSøknad } from 'lib/types/types';
import { getStringFromPossiblyArrayQuery } from '@navikt/aap-felles-utils-client';
import { beskyttetSide } from '@navikt/aap-felles-utils';
import metrics from 'lib/metrics';
import { getSøknaderInnsending } from 'pages/api/soknader/soknader';
import { EttersendelseInnsending } from 'components/ettersendelseinnsending/EttersendelseInnsending';

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

  const stopTimer = metrics.getServersidePropsDurationHistogram.startTimer({
    path: '/{uuid}/ettersendelse',
  });

  const søknaderFraInnsending = await getSøknaderInnsending(ctx.req);
  const søknadFraInnsending = søknaderFraInnsending.find((søknad) => søknad.innsendingsId === uuid) ?? null;

  stopTimer();

  if (!søknadFraInnsending) {
    return {
      notFound: true,
    };
  }

  return {
    props: { søknadFraInnsending },
  };
});

export default Index;
