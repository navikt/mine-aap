import { BodyLong } from '@navikt/ds-react';
import { beskrivelser } from '../../tidslinjeMapping';
import { TidslinjeSteg } from '../TidslinjeSteg';
import type { HendelseStegProps } from '../types';

export function FerdigBehandlet(props: HendelseStegProps) {
  return (
    <TidslinjeSteg {...props} title="Du får svar">
      <BodyLong>{beskrivelser.FERDIG_BEHANDLET}</BodyLong>
    </TidslinjeSteg>
  );
}
