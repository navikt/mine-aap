import { beskyttetApi, getAccessTokenFromRequest, isMock, logger, tokenXApiProxy } from '@navikt/aap-felles-utils';
import { getStringFromPossiblyArrayQuery } from '@navikt/aap-felles-utils-client';
import metrics from 'lib/metrics';
import { mockEttersendelserSoknad } from 'lib/mock/mockSoknad';
import { MineAapSoknadMedEttersendinger } from 'lib/types/types';

const handler = beskyttetApi(async (req, res) => {
  const accessToken = getAccessTokenFromRequest(req);
  const uuid = getStringFromPossiblyArrayQuery(req.query.uuid);
  if (!uuid) {
    res.status(400).json({ error: 'uuid må være en string' });
    return;
  }
  const ettersendelse = await getEttersendelserForSøknad(uuid, accessToken);
  res.status(200).json(ettersendelse);
});

export const getEttersendelserForSøknad = async (
  uuid: string,
  accessToken?: string
): Promise<MineAapSoknadMedEttersendinger> => {
  if (isMock()) return mockEttersendelserSoknad;
  const ettersendelse: MineAapSoknadMedEttersendinger = await tokenXApiProxy({
    url: `${process.env.INNSENDING_URL}/innsending/søknader/${uuid}/ettersendelser`,
    prometheusPath: '/innsending/soeknader',
    method: 'GET',
    audience: process.env.INNSENDING_AUDIENCE ?? '',
    bearerToken: accessToken,
    logger: logger,
    metricsStatusCodeCounter: metrics.backendApiStatusCodeCounter,
    metricsTimer: metrics.backendApiDurationHistogram,
  });
  return ettersendelse;
};

export default handler;
