import { DecoratorFetchProps, DecoratorNaisEnv, DecoratorUrlProps } from 'lib/decorator/decorator-types';

export async function getDecoratorMetadata(props: DecoratorFetchProps): Promise<{
  language: string;
  scripts: string[];
  inlineScripts: string[];
  styles: string[];
}> {
  const url: string = getDecoratorUrl(props, 'scripts');

  console.log(`Fetching decorator metadata ${url}`);
  const response = await fetch(url, {
    next: { revalidate: 15 * 60 },
  } as RequestInit);

  return response.json();
}

export async function getDecoratorBlocks(props: DecoratorFetchProps): Promise<{ header: string; footer: string }> {
  const headerUrl: string = getDecoratorUrl(props, 'header');
  const footerUrl: string = getDecoratorUrl(props, 'footer');

  console.log('Fetching header and footer');
  const [header, footer] = await Promise.all([
    fetch(headerUrl, {
      next: { revalidate: 15 * 60 },
    } as RequestInit),
    fetch(footerUrl, {
      next: { revalidate: 15 * 60 },
    } as RequestInit),
  ]);

  return {
    header: await header.text(),
    footer: await footer.text(),
  };
}

type NaisUrls = Record<DecoratorNaisEnv, string>;

const externalUrls: NaisUrls = {
  prod: 'https://www.nav.no/dekoratoren',
  dev: 'https://dekoratoren.ekstern.dev.nav.no',
  beta: 'https://dekoratoren-beta.intern.dev.nav.no',
  betaTms: 'https://dekoratoren-beta-tms.intern.dev.nav.no',
  devNext: 'https://decorator-next.ekstern.dev.nav.no',
};

const serviceUrls: NaisUrls = {
  prod: 'http://nav-dekoratoren.personbruker',
  dev: 'http://nav-dekoratoren.personbruker',
  beta: 'http://nav-dekoratoren-beta.personbruker',
  betaTms: 'http://nav-dekoratoren-beta-tms.personbruker',
  devNext: 'http://decorator-next.personbruker',
};

const naisGcpClusters: Record<string, true> = {
  'dev-gcp': true,
  'prod-gcp': true,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const objectToQueryString = (params: Record<string, any>): string =>
  params
    ? Object.entries(params).reduce(
        (acc, [k, v], i) =>
          v !== undefined
            ? `${acc}${i ? '&' : '?'}${k}=${encodeURIComponent(typeof v === 'object' ? JSON.stringify(v) : v)}`
            : acc,
        ''
      )
    : '';

const isNaisApp = (): boolean =>
  Boolean(
    typeof process !== 'undefined' && process.env.NAIS_CLUSTER_NAME && naisGcpClusters[process.env.NAIS_CLUSTER_NAME]
  );

const getNaisUrl = (env: DecoratorNaisEnv, csr = false, serviceDiscovery = true): string => {
  const shouldUseServiceDiscovery = serviceDiscovery && !csr && isNaisApp();

  return (shouldUseServiceDiscovery ? serviceUrls[env] : externalUrls[env]) || externalUrls.prod;
};

export const getDecoratorUrl = (props: DecoratorUrlProps, path: string): string => {
  const { env, params, csr } = props;
  const baseUrl = env === 'localhost' ? props.localUrl : getNaisUrl(env, csr, props.serviceDiscovery);

  if (!params) {
    return baseUrl;
  }

  return `${baseUrl}${path != null ? `/${path}` : ''}${objectToQueryString(params)}`;
};
