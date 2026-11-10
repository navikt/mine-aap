'use client';

import type { Behandling, BehandlingHendelse } from 'lib/types/apiinternTypes';
import { useLocale } from 'next-intl';
import { Fragment, useState } from 'react';
import styles from './Tidslinje.module.css';
import { AlderLovvalgMedlemskap } from './TidslinjeSteg/AlderLovvalgMedlemskap/AlderLovvalgMedlemskap';
import { FerdigBehandlet } from './TidslinjeSteg/FerdigBehandlet/FerdigBehandlet';
import { NavKontor } from './TidslinjeSteg/NavKontor/NavKontor';
import { SoknadMottatt } from './TidslinjeSteg/SoknadMottatt/SoknadMottatt';
import type { HendelseStegProps } from './TidslinjeSteg/types';
import { UnderBehandling } from './TidslinjeSteg/UnderBehandling/UnderBehandling';

interface Props {
  behandling: Behandling;
}

function renderSteg(hendelse: BehandlingHendelse, steg: HendelseStegProps) {
  switch (hendelse.navn) {
    case 'SØKNAD_MOTTATT':
      return <SoknadMottatt hendelse={hendelse} steg={steg} />;
    case 'ALDER_LOVVALG_MEDLEMSKAP':
      return <AlderLovvalgMedlemskap hendelse={hendelse} steg={steg} />;
    case 'NAV_KONTOR':
      return <NavKontor hendelse={hendelse} steg={steg} />;
    case 'NAY':
      return <UnderBehandling hendelse={hendelse} steg={steg} />;
    case 'FERDIG_BEHANDLET':
      return <FerdigBehandlet hendelse={hendelse} steg={steg} />;
  }
}

export const Tidslinje = ({ behandling }: Props) => {
  const locale = useLocale();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(() => {
    const activeIndex = behandling.hendelser.findIndex((hendelse) => hendelse.progresjon === 'AKTIV');
    return activeIndex === -1 ? null : activeIndex;
  });
  const dateFormatter = new Intl.DateTimeFormat(locale === 'nn' ? 'nn-NO' : 'nb-NO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Oslo',
  });

  if (behandling.hendelser.length === 0) {
    return null;
  }

  return (
    <ol className={styles.timeline} aria-label="Søknadens tidslinje">
      {behandling.hendelser.map((hendelse, index) => {
        const isExpanded = expandedIndex === index;

        return (
          <Fragment key={`${hendelse.navn}-${hendelse.sistEndret}`}>
            {renderSteg(hendelse, {
              open: isExpanded,
              onToggle: () => setExpandedIndex((previous) => (previous === index ? null : index)),
              dateFormatter,
            })}
          </Fragment>
        );
      })}
    </ol>
  );
};
