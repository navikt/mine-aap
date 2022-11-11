import { NextApiRequest, NextApiResponse } from 'next/dist/shared/lib/utils';
import axios from 'axios';
import { randomUUID } from 'crypto';
import { getTokenXToken } from 'lib/auth/getTokenXToken';
import { logger } from '@navikt/aap-felles-innbygger-utils';
import { ErrorMedStatus } from 'lib/auth/ErrorMedStatus';
import metrics from '../metrics';

interface Opts {
  url: string;
  prometheusPath: string;
  audience: string;
  method: 'GET' | 'POST' | 'DELETE';
  data?: string;
  req?: NextApiRequest;
  noResponse?: boolean;
  rawResonse?: boolean;
  contentType?: string;
  bearerToken?: string;
}

export const tokenXProxy = async (opts: Opts) => {
  logger.info('starter request mot ' + opts.url);
  const idportenToken = opts.bearerToken!.split(' ')[1];
  const tokenxToken = await getTokenXToken(idportenToken, opts.audience);

  const stopTimer = metrics.backendApiDurationHistogram.startTimer({ path: opts.prometheusPath });
  const requestId = randomUUID();
  const response = await fetch(opts.url, {
    method: opts.method,
    body: opts.data,
    headers: {
      Authorization: `Bearer ${tokenxToken}`,
      'Content-Type': opts.contentType ?? 'application/json',
      'X-Request-ID': requestId,
    },
  });
  stopTimer();
  metrics.backendApiStatusCodeCounter.inc({ path: opts.prometheusPath, status: response.status });

  if (response.status < 200 || response.status > 300) {
    const headers = response.headers.get('content-type');
    const isJson =
      headers?.includes('application/json') || headers?.includes('application/problem+json');
    let data;
    try {
      data = isJson ? await response.json() : response.text();
    } catch (err: any) {
      logger.error({
        msg: `unable to parse data from ${opts.url}`,
        error: err.toString(),
        requestId,
      });
    }
    logger.error({
      msg: `tokenXProxy: status for ${opts.url} er ${response.status}: ${response.statusText}.`,
      navCallId: data?.['Nav-CallId'],
      requestId,
      data,
    });
    throw new ErrorMedStatus(
      `tokenXProxy: status for ${opts.url} er ${response.status}.`,
      response.status,
      data?.['Nav-CallId'] || ''
    );
  }

  logger.info(`Vellyket tokenXProxy-request mot ${opts.url}. Status: ${response.status}`);
  if (opts.noResponse) {
    return;
  }
  if (opts.rawResonse) {
    return response;
  }

  return await response.json();
};

interface AxiosOpts {
  url: string;
  prometheusPath: string;
  audience: string;
  req: NextApiRequest;
  res: NextApiResponse;
  bearerToken?: string;
}

export const tokenXAxiosProxy = async (opts: AxiosOpts) => {
  const idportenToken = opts.bearerToken!.split(' ')[1];
  const tokenxToken = await getTokenXToken(idportenToken, opts.audience);

  logger.info('Starter opplasting av fil til ' + opts.url);

  const requestId = randomUUID();
  try {
    const stopTimer = metrics.backendApiDurationHistogram.startTimer({ path: opts.prometheusPath });
    const { data, status } = await axios.post(opts.url, opts.req, {
      responseType: 'stream',
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      headers: {
        'Content-Type': opts.req?.headers['content-type'] ?? '', // which is multipart/form-data with boundary included
        Authorization: `Bearer ${tokenxToken}`,
        'X-Request-ID': requestId,
      },
    });
    stopTimer();
    metrics.backendApiStatusCodeCounter.inc({ path: opts.prometheusPath, status: status });
    logger.info('Vellykket opplasting av fil til ' + opts.url);
    return data.pipe(opts.res);
  } catch (e: any) {
    if (e?.response?.status) {
      e.response.data?.pipe(opts.res);
      metrics.backendApiStatusCodeCounter.inc({
        path: opts.prometheusPath,
        status: e.response.status,
      });
      return opts.res.status(e.response.status);
    }
    logger.error({ msg: 'tokenXAxiosError', error: e.toString(), requestId });
    return opts.res.status(500).json('tokenXAxiosProxy server error');
  }
};
