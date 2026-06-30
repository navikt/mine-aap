import { logError } from 'lib/server/logger';
import { getOnBefalfOfToken } from 'lib/services/fetchProxy';
import { hentLocalToken } from 'lib/services/localFetch';
import { isLocal } from 'lib/utils/environments';
import { NextResponse } from 'next/server';

const innsendingApiBaseUrl = process.env.INNSENDING_URL;
const innsendingAudience = process.env.INNSENDING_AUDIENCE ?? '';
const oppslagApiBaseUrl = process.env.OPPSLAG_URL;
const oppslagAudience = process.env.OPPSLAG_AUDIENCE ?? '';

interface Props {
  url: string;
  req: Request;
  token: string;
}
async function simpleFetchProxy<ResponseType>({ url, token, req }: Props) {
  const requestHeaders = new Headers(req.headers);
  console.log('request headers');
  console.log(requestHeaders.get('Content-type'));
  requestHeaders.set('Authorization', `Bearer ${token}`);
  requestHeaders.delete('host');

  let requestBody: ReadableStream | null = null;
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    requestBody = req.body;
  }

  try {
    const backendResponse = await fetch(url, {
      method: req.method,
      headers: requestHeaders,
      body: requestBody,
      // @ts-expect-error duplex required when passing body
      duplex: requestBody ? 'half' : undefined,
    });

    return new NextResponse<ResponseType>(backendResponse.body, {
      status: backendResponse.status,
      headers: backendResponse.headers,
    });
  } catch (error) {
    logError('Proxy Error:', error);
    return NextResponse.json({ error: 'Proxy failed to reach backend' }, { status: 500 });
  }
}

export async function oppslagProxyPass(path: string, req: Request) {
  const url = `${oppslagApiBaseUrl}${path}`;
  const oboToken = isLocal() ? await hentLocalToken(oppslagAudience) : await getOnBefalfOfToken(oppslagAudience, url);
  return simpleFetchProxy({
    url,
    token: oboToken,
    req,
  });
}
export async function innsendingProxyPass<ResponseType>(path: string, req: Request) {
  const url = `${innsendingApiBaseUrl}${path}`;
  const oboToken = isLocal()
    ? await hentLocalToken(innsendingAudience)
    : await getOnBefalfOfToken(innsendingAudience, url);
  return simpleFetchProxy<ResponseType>({
    url,
    token: oboToken,
    req,
  });
}
