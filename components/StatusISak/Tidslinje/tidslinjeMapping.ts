import type {
  BehandlingHendelseNavn,
  BehandlingHendelseProgresjon,
  BehandlingsHendelse,
} from 'lib/services/apiInternService';

export const progresjonTekst: Record<BehandlingHendelseProgresjon, string> = {
  aktiv: 'Pågående steg',
  fullført: 'Fullført steg',
  'ikke-påbegynt': 'Ikke påbegynt',
};

export const beskrivelser: Record<BehandlingHendelseNavn, string> = {
  SØKNAD_MOTTATT: 'Dette steget gjelder mottak av søknaden din.',
  ALDER_LOVVALG_MEDLEMSKAP: 'Vi vurderer alder, lovvalg og medlemskap i folketrygden.',
  NAV_KONTOR:
    'I kartleggingen samarbeider vi med deg, legen og arbeidsgiveren din. Vi kartlegger også hvordan skaden eller sykdommen din påvirker mulighetene til å jobbe og motta oppfølging fra Nav. Oppfølging får du tilbud om i eget brev.',
  UNDER_BEHANDLING: 'Dette steget gjelder den siste delen av behandlingen av søknaden din.',
  FERDIG_BEHANDLET: 'Når søknaden er ferdig behandlet, får du svar i et vedtak.',
};

export const venteStatusTekst: Record<NonNullable<BehandlingsHendelse['status']>, string> = {
  VENTER_PÅ_INFORMASJON_FRA_UTENLANDSKE_MYNDIGHETER: 'Vi venter på informasjon fra utenlandske myndigheter.',
  MOTTATT_INFORMASJON_FRA_UTENLANDSKE_MYNDIGHETER: 'Vi har mottatt informasjon fra utenlandske myndigheter.',
  VENTER_PÅ_LEGEERKLÆRING: 'Vi venter på legeerklæring.',
  PURRET_PÅ_LEGEERKLÆRING: 'Vi har purret på legeerklæring.',
  LEGEERKLÆRING_MOTTATT: 'Vi har mottatt legeerklæring.',
  VENTER_I_KØ: 'Søknaden venter i kø.',
  FERDIG: 'Dette steget er ferdig.',
  UNDER_BEHANDLING: 'Dette steget er under behandling.',
};

export const navKontorTekst = {
  tittel: 'Vi kartlegger situasjonen din',
  varighet: 'Kartleggingen tar 1-2 måneder.',
  oppfølging: 'Du hører fra oss hvis det trengs.',
};
