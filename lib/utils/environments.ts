const MOCK_ENVIRONMENTS = ['localhost'];

export const isMock = () => MOCK_ENVIRONMENTS.includes(process.env.NEXT_PUBLIC_ENVIRONMENT ?? '');

export const isProduction = () => process.env.NEXT_PUBLIC_ENVIRONMENT === 'prod';

export function getEnvironment(): 'prod' | 'dev' {
  if (isProduction()) {
    return 'prod';
  } else {
    return 'dev';
  }
}
