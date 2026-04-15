import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import { isValidLocale } from 'lib/utils/locale';

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !isValidLocale(locale)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../lib/translations/${locale}.json`)).default,
  };
});
