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

//TODO: Avklare hvor dato skal hentes fra og legge til i beskrivelse
//TODO: Logikk for switch mellom søknadGodkjent og søknadIkkeGodkjent, avventer API
export function FerdigBehandlet(props: FerdigBehandletProps) {
  const t = useTranslations('statusisak.ferdigBehandlet');
  return (
    <TidslinjeSteg
      {...props}
      title={t(props.hendelse.progresjon === 'FULLFØRT' ? 'tittel.fullført' : 'tittel.aktivOgIkkePåbegynt')}
    >
      <StatusTagOgBeskrivelse navn={props.hendelse.navn} />
      <BodyLong>{t('beskrivelse')}</BodyLong>
    </TidslinjeSteg>
  );
}
