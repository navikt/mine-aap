import { proxyApiRouteRequest } from '@navikt/next-api-proxy';
import { NextApiRequest, NextApiResponse } from 'next';
import { getAccessTokenFromRequest, getTokenX, logError, logInfo } from '@navikt/aap-felles-utils';
import metrics from '../metrics';

export const tokenXProxy = async (
  req: NextApiRequest,
  res: NextApiResponse,
  path: string,
  prometheusPath: string,
  hostname: 'oppslag' | 'soknad-api',
  audience: string
) => {
  const accessToken = getAccessTokenFromRequest(req)?.substring('Bearer '.length)!;
  let tokenxToken;
  try {
    tokenxToken = await getTokenX(accessToken, audience);
  } catch (err: any) {
    logError(`getTokenXError mot ${path}`, err);
  }
  const stopTimer = metrics.backendApiDurationHistogram.startTimer({ path: prometheusPath });
  const result = await proxyApiRouteRequest({
    req,
    res,
    hostname,
    path,
    bearerToken: tokenxToken,
    https: false,
  });

  logInfo(`res from tokenXProxy: ${res.status}`);
  stopTimer();

  return result;
};
