import type { BehandlingHendelseProgresjon } from 'lib/types/apiinternTypes';
import { useTranslations } from 'next-intl';

export const progresjonTekst = (): Record<BehandlingHendelseProgresjon, string> => {
  const t = useTranslations('statusisak.hendelse.progresjon');
  return {
    AKTIV: t('aktiv'),
    FULLFØRT: t('fullført'),
    IKKE_PÅBEGYNT: t('ikkePåbegynt'),
  };
};
