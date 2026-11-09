import { BodyLong } from '@navikt/ds-react';
import { beskrivelser, venteStatusTekst } from '../../tidslinjeMapping';
import { TidslinjeSteg } from '../TidslinjeSteg';
import type { HendelseStegProps } from '../types';

export function AlderLovvalgMedlemskap({ hendelse, ...props }: HendelseStegProps) {
  const title = hendelse.progresjon === 'fullført' ? 'Vi har sjekket søknaden din' : 'Vi sjekker søknaden din';
  const beskrivelse =
    hendelse.status && hendelse.progresjon !== 'ikke-påbegynt'
      ? venteStatusTekst[hendelse.status]
      : beskrivelser.ALDER_LOVVALG_MEDLEMSKAP;

  return (
    <TidslinjeSteg {...props} hendelse={hendelse} title={title}>
      <BodyLong>{beskrivelse}</BodyLong>
    </TidslinjeSteg>
  );
}
