import 'server-only';

const dictionaries = {
  nb: () => import('../../../lib/translations/nb.json').then((module) => module.default),
  nn: () => import('../../../lib/translations/nn.json').then((module) => module.default),
};

export const getDictionary = async (locale: 'nb' | 'nn' = 'nb') => dictionaries[locale]();
