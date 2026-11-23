import { BodyLong } from '@navikt/ds-react';
import type { BehandlingHendelseFerdigBehandlet } from 'lib/types/apiinternTypes';
import { useTranslations } from 'next-intl';
import { StatusTagOgBeskrivelse } from '../../StatusTagOgBeskrivelse/StatusTagOgBeskrivelse';
import { TidslinjeSteg } from '../TidslinjeSteg';
import type { HendelseStegProps } from '../types';

export interface FerdigBehandletProps {
  steg: HendelseStegProps;
  hendelse: BehandlingHendelseFerdigBehandlet;
}
export function FerdigBehandlet(props: FerdigBehandletProps) {
  const t = useTranslations('statusisak.ferdigBehandlet');
  return (
    <TidslinjeSteg {...props} title="Du får svar">
      <StatusTagOgBeskrivelse navn={props.hendelse.navn} />
      <BodyLong>{t('status.beskrivelse.søknadGodkjent')}</BodyLong>
    </TidslinjeSteg>
  );
}
