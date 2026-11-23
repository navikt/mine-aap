import type { BehandlingHendelse, BehandlingHendelseNavn } from 'lib/types/apiinternTypes';

type HendelseStatus<T> = T extends { status?: infer Status } ? Status : never;

export type StatusTagStatus =
  | HendelseStatus<BehandlingHendelse>
  | 'SØKNAD_STÅR_I_KØ' // Fra NAY får saken fra nav kontoret, til noen har plukket den
  | 'SØKNAD_BEHANDLES' // Fra noen har plukket den sier vi "behandles" og statusen bevares til søknaden er ferdig behandlet
  | 'SØKNAD_GODKJENT'
  | 'SØKNAD_IKKE_GODKJENT'
  | 'SØKNAD_FERDIG_BEHANDLET';
  // SØKNAD_TRUKKET - avklares i samarbeid med AAP
  // PURRET_PÅ_LEGERERKLÆRING - skriveleif
  
interface StatusVisning {
  tag?: string;
  beskrivelse?: string;
  showClockIcon?: boolean;
}

export const statusConfig: Record<
  BehandlingHendelseNavn,
  Partial<Record<NonNullable<StatusTagStatus>, StatusVisning | null>>
> = {
  SØKNAD_MOTTATT: {},
  ALDER_LOVVALG_MEDLEMSKAP: {
    VENTER_PÅ_INFORMASJON_FRA_UTENLANDSKE_MYNDIGHETER: {
      tag: 'alderLovvalgMedlemskap.status.tag.venterPåInformasjonFraUtenlandskeMyndigheter',
      beskrivelse: 'alderLovvalgMedlemskap.status.beskrivelse.venterPåInformasjonFraUtenlandskeMyndigheter',
      showClockIcon: true,
    },
    MOTTATT_INFORMASJON_FRA_UTENLANDSKE_MYNDIGHETER: null,
  },
  NAV_KONTOR: {
    VENTER_PÅ_LEGEERKLÆRING: {
      tag: 'navKontor.status.tag.venterPåLegeerklæring',
      beskrivelse: 'navKontor.status.beskrivelse.venterPåLegeerklæring',
      showClockIcon: true,
    },
    PURRET_PÅ_LEGERERKLÆRING: {
      tag: 'navKontor.status.tag.purretPåLegeerklæring',
      beskrivelse: 'navKontor.status.beskrivelse.purretPåLegeerklæring',
      showClockIcon: true,
    },
    MOTTATT_LEGEERKLÆRING: {
      tag: 'navKontor.status.tag.mottattLegeerklæring',
    },
  },
  NAY: {
    SØKNAD_STÅR_I_KØ: {
      tag: 'underBehandling.status.tag.søknadStårIKø',
      beskrivelse: 'underBehandling.status.beskrivelse.søknadStårIKø',
      showClockIcon: true,
    },
    SØKNAD_BEHANDLES: {
      tag: 'underBehandling.status.tag.søknadBehandles',
    },
    VENTER_PÅ_INFORMASJON_FRA_UTENLANDSKE_MYNDIGHETER: {
      tag: 'underBehandling.status.tag.venterPåInformasjonFraUtenlandskeMyndigheter',
      beskrivelse: 'underBehandling.status.beskrivelse.venterPåInformasjonFraUtenlandskeMyndigheter',
      showClockIcon: true,
    },
    MOTTATT_INFORMASJON_FRA_UTENLANDSKE_MYNDIGHETER: null,
  },
  FERDIG_BEHANDLET: {
    SØKNAD_GODKJENT: {
      beskrivelse: 'ferdigBehandlet.status.beskrivelse.søknadGodkjent',
    },
    SØKNAD_IKKE_GODKJENT: {
      beskrivelse: 'ferdigBehandlet.status.beskrivelse.søknadIkkeGodkjent',
    },
    SØKNAD_FERDIG_BEHANDLET: {
      tag: 'ferdigBehandlet.status.tag.søknadFerdigBehandlet',
    },
  },
};
