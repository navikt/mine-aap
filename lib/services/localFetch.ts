import { logError } from 'lib/server/logger';

export async function hentLocalToken() {
  try {
    const url =
      'https://fakedings.intern.dev.nav.no/fake/idporten?pid=12345678901&client_id=localhost:aap:innsyn&acr=idporten-loa-substantial';
    return fetch(url, { method: 'GET', next: { revalidate: 0 } }).then((token) => token.text());
  } catch (error) {
    logError('hentLocalToken feilet', error);
    return Promise.resolve('dummy-token');
  }
}
