import { logError } from 'lib/server/logger';

export async function hentLocalToken(scope: string) {
  try {
    const baseUrl = scope === process.env.INNSENDING_AUDIENCE ? process.env.INNSENDING_URL : process.env.OPPSLAG_URL;
    const url = `${baseUrl}/test/local-token`;
    const res = await fetch(url, { method: 'GET', next: { revalidate: 0 } });
    return res.text();
  } catch (err) {
    logError('hentLocalToken feilet', err);
    return Promise.resolve('dummy-token');
  }
}
