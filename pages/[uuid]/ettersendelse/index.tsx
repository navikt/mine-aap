import { GetServerSidePropsResult, NextPageContext } from 'next';
import { InnsendingSøknad, Søknad } from 'lib/types/types';
import { getSøknad } from 'pages/api/soknader/[uuid]';
import { getStringFromPossiblyArrayQuery } from '@navikt/aap-felles-utils-client';
import { beskyttetSide, getAccessToken, logger } from '@navikt/aap-felles-utils';
import metrics from 'lib/metrics';
import { getSøknaderInnsending } from 'pages/api/soknader/soknader';
import { EttersendelseInnsending } from 'components/ettersendelseinnsending/EttersendelseInnsending';
import { EttersendelseSoknadApi } from 'components/ettersendelsesoknadapi/EttersendelseSoknadApi';

interface PageProps {
  søknad?: Søknad;
  søknadFraInnsending?: InnsendingSøknad;
}

const Index = ({ søknad, søknadFraInnsending }: PageProps) => {
  return (
    <>
      {søknadFraInnsending && <EttersendelseInnsending søknad={søknadFraInnsending} />}
      {søknad && !søknadFraInnsending && <EttersendelseSoknadApi søknad={søknad} />}
    </>
  );
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

  const bearerToken = getAccessToken(ctx);

  // soknad-api returnerer null når den ikke finner søknad. Fører til parsing error. Forventet oppførsel når vi slår opp en søknad som er sendt inn med ny innsending
  let søknad = null;
  try {
    søknad = await getSøknad(uuid, bearerToken);
  } catch (e) {
    logger.info('getSøknad fra søknad-api feilet:' + e?.toString());
  }

  if (ctx.req === undefined) {
    throw new Error('Request object is undefined');
  }

  const søknaderFraInnsending = await getSøknaderInnsending(ctx.req);
  const søknadFraInnsending = søknaderFraInnsending.find((søknad) => søknad.innsendingsId === uuid) ?? null;

  stopTimer();

  if (!søknad && !søknadFraInnsending) {
    return {
      notFound: true,
    };
  }

  return {
    props: { søknad, søknadFraInnsending },
  };
});

export default Index;
