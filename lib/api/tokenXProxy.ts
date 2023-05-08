import { proxyApiRouteRequest } from '@navikt/next-api-proxy';
import { NextApiRequest, NextApiResponse } from 'next';
import { getAccessTokenFromRequest, getTokenX, logger } from '@navikt/aap-felles-innbygger-utils';
import metrics from '../metrics';

export const tokenXProxy = async (
  req: NextApiRequest,
  res: NextApiResponse,
  path: string,
  prometheusPath: string
) => {
  const accessToken = getAccessTokenFromRequest(req)?.substring('Bearer '.length)!;
  let tokenxToken;
  try {
    tokenxToken = await getTokenX(accessToken, process.env.SOKNAD_API_AUDIENCE!);
  } catch (err: any) {
    logger.error({ msg: 'getTokenXError', error: err });
  }
  const stopTimer = metrics.backendApiDurationHistogram.startTimer({ path: prometheusPath });
  const result = await proxyApiRouteRequest({
    req,
    res,
    hostname: 'soknad-api',
    path: path,
    bearerToken: tokenxToken,
    https: false,
  });
  stopTimer();

  return result;
};
