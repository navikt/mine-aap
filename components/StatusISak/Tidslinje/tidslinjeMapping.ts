import type {
  BehandlingHendelseAlderLovvalg,
  BehandlingHendelseNavn,
  BehandlingHendelseNay,
  BehandlingHendelseProgresjon,
} from 'lib/types/apiinternTypes';
import { useTranslations } from 'next-intl';

export const progresjonTekst = (): Record<BehandlingHendelseProgresjon, string> => {
  const t = useTranslations('statusisak.behandling.hendelse.progresjon');
  return {
    AKTIV: t('aktiv'),
    FULLFØRT: t('fullført'),
    IKKE_PÅBEGYNT: t('ikkePåbegynt'),
  };
};

export const beskrivelser = (): Record<BehandlingHendelseNavn, string> => {
  const t = useTranslations('statusisak.behandling.hendelse.navn');
  return {
    SØKNAD_MOTTATT: t('søknadMottatt'),
    ALDER_LOVVALG_MEDLEMSKAP: t('alderLovvalgMedlemskap'),
    NAV_KONTOR: t('navKontor'),
    NAY: t('nay'),
    FERDIG_BEHANDLET: t('ferdigBehandlet'),
  };
};

export const venteStatusTekstNay = (): Record<NonNullable<BehandlingHendelseNay['status']>, string> => {
  return {
    VENTER_PÅ_INFORMASJON_FRA_UTENLANDSKE_MYNDIGHETER: 'Vi venter på informasjon fra utenlandske myndigheter.',
    MOTTATT_INFORMASJON_FRA_UTENLANDSKE_MYNDIGHETER: 'Vi har mottatt informasjon fra utenlandske myndigheter.',
  };
};
export const venteStatusTekstAlderLovvalgMedlemskap = (): Record<
  NonNullable<BehandlingHendelseAlderLovvalg['status']>,
  string
> => {
  const t = useTranslations('statusisak.alderLovvalgMedlemskap.status');
  return {
    VENTER_PÅ_INFORMASJON_FRA_UTENLANDSKE_MYNDIGHETER: t('venterPåInformasjonFraUtenlandskeMyndigheter'),
    MOTTATT_INFORMASJON_FRA_UTENLANDSKE_MYNDIGHETER: t('mottattInformasjonFraUtenlandskeMyndigheter'),
  };
};
