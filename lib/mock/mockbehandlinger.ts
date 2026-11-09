import type { Behandling } from 'lib/services/apiInternService';

export const mockBehandlinger: Behandling[] = [
  {
    behandlingId: 'behandling1',
    behandlingType: 'SØKNAD',
    navn: 'Søknad om arbeidsavklaringspenger',
    vedtakFattet: true,
    vedtakFattetDato: '2026-10-15',
    opprettet: '2026-09-09',
    hendelser: [
      {
        navn: 'SØKNAD_MOTTATT',
        timestamp: '2026-01-01',
        progresjon: 'fullført',
      },
      {
        navn: 'ALDER_LOVVALG_MEDLEMSKAP',
        timestamp: '2026-03-01',
        progresjon: 'fullført',
        status: 'VENTER_PÅ_INFORMASJON_FRA_UTENLANDSKE_MYNDIGHETER',
      },
      {
        navn: 'NAV_KONTOR',
        timestamp: '2026-03-01',
        progresjon: 'fullført',
        status: 'VENTER_PÅ_LEGEERKLÆRING',
      },
      {
        navn: 'UNDER_BEHANDLING',
        timestamp: '2026-05-01',
        progresjon: 'aktiv',
        status: 'VENTER_I_KØ',
      },
      {
        navn: 'FERDIG_BEHANDLET',
        timestamp: '2026-05-01',
        progresjon: 'ikke-påbegynt',
      },
    ],
  },
  {
    behandlingId: 'behandling2',
    behandlingType: 'KLAGE',
    navn: 'Klage på vedtak om arbeidsavklaringspenger',
    vedtakFattet: false,
    opprettet: '2026-11-01',
    hendelser: [
      {
        navn: 'SØKNAD_MOTTATT',
        timestamp: '2026-11-01',
        progresjon: 'fullført',
      },
      {
        navn: 'ALDER_LOVVALG_MEDLEMSKAP',
        timestamp: '2026-03-01',
        progresjon: 'fullført',
        status: 'VENTER_PÅ_INFORMASJON_FRA_UTENLANDSKE_MYNDIGHETER',
      },
      {
        navn: 'NAV_KONTOR',
        timestamp: '2026-03-01',
        progresjon: 'aktiv',
        status: 'VENTER_PÅ_LEGEERKLÆRING',
      },
      {
        navn: 'UNDER_BEHANDLING',
        timestamp: '2026-05-01',
        progresjon: 'ikke-påbegynt',
      },
      {
        navn: 'FERDIG_BEHANDLET',
        timestamp: '2026-05-01',
        progresjon: 'ikke-påbegynt',
      },
    ],
  },
];

export default mockBehandlinger;