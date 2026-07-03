export const isLocal = () => process.env.NEXT_PUBLIC_ENVIRONMENT === 'localhost';

export function isMock() {
  return isLocal() && process.env.LOCAL_API === 'MOCK';
}

export const isProduction = () => process.env.NEXT_PUBLIC_ENVIRONMENT === 'prod';

export function getEnvironment(): 'prod' | 'dev' {
  if (isProduction()) {
    return 'prod';
  } else {
    return 'dev';
  }
}
