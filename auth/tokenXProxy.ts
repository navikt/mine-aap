import { NextApiRequest, NextApiResponse } from 'next/dist/shared/lib/utils';
// import axios from 'axios';

import { getTokenXToken } from './getTokenXToken';
import logger from '../utils/logger';
import { ErrorMedStatus } from './ErrorMedStatus';

interface Opts {
  url: string;
  audience: string;
  method: 'GET' | 'POST' | 'DELETE';
  data?: string;
  req?: NextApiRequest;
  contentType?: string;
  bearerToken?: string;
}

export const tokenXProxy = async (opts: Opts) => {
  logger.info('starter request mot ' + opts.url);
  const idportenToken = opts.bearerToken!.split(' ')[1];
  const tokenxToken = await getTokenXToken(idportenToken, opts.audience);
  const response = await fetch(opts.url, {
    method: opts.method,
    body: opts.data,
    headers: {
      Authorization: `Bearer ${tokenxToken}`,
      'Content-Type': opts.contentType ?? 'application/json',
    },
  });

  if (response.status < 200 || response.status > 300) {
    logger.error(`tokenXProxy: status for ${opts.url} er ${response.status}.`);
    throw new ErrorMedStatus(
      `tokenXProxy: status for ${opts.url} er ${response.status}.`,
      response.status
    );
  }

  return await response.json();
};
