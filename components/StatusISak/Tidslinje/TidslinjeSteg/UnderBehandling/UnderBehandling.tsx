import { BodyLong } from '@navikt/ds-react';
import { beskrivelser, venteStatusTekst } from '../../tidslinjeMapping';
import { TidslinjeSteg } from '../TidslinjeSteg';
import type { HendelseStegProps } from '../types';

export function UnderBehandling({ hendelse, ...props }: HendelseStegProps) {
  const beskrivelse =
    hendelse.status && hendelse.progresjon !== 'ikke-påbegynt'
      ? venteStatusTekst[hendelse.status]
      : beskrivelser.UNDER_BEHANDLING;

  return (
    <TidslinjeSteg {...props} hendelse={hendelse} title="Vi behandler siste del av søknaden din">
      <BodyLong>{beskrivelse}</BodyLong>
    </TidslinjeSteg>
  );
}
