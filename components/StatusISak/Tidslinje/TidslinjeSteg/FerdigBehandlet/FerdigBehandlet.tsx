import { BodyLong } from '@navikt/ds-react';
import type { BehandlingHendelseFerdigBehandlet } from 'lib/types/apiinternTypes';
import { beskrivelser } from '../../tidslinjeMapping';
import { TidslinjeSteg } from '../TidslinjeSteg';
import type { HendelseStegProps } from '../types';

export interface FerdigBehandletProps {
  steg: HendelseStegProps;
  hendelse: BehandlingHendelseFerdigBehandlet;
}
export function FerdigBehandlet(props: FerdigBehandletProps) {
  return (
    <TidslinjeSteg {...props} title="Du får svar">
      <BodyLong>{beskrivelser().FERDIG_BEHANDLET}</BodyLong>
    </TidslinjeSteg>
  );
}
