import type { Behandling, SakMedBehandlinger } from 'lib/types/apiinternTypes';
import { BodyLong, Heading, Link } from 'node_modules/@navikt/ds-react';
import styles from './BehandlingerList.module.css';

//TODO: DokumentList og BehandlingerList bør kanskje slås sammen, da utseende er likt med unntak av inngress

export const BehandlingerList = ({ sakMedBehandlinger }: { sakMedBehandlinger: SakMedBehandlinger }) => {
  return (
    <section>
      <Heading level="2" size="medium" className={styles.heading}>
        Tidligere behandlinger
      </Heading>
      <ul className={styles.list}>
        {sakMedBehandlinger.behandlinger
          .filter((behandling) => behandling.avsluttet)
          .map((behandling) => (
            <BehandlingsItem
              key={behandling.behandlingReferanse}
              saksnummer={sakMedBehandlinger.saksnummer}
              behandling={behandling}
            />
          ))}
      </ul>
    </section>
  );
};

const BehandlingsItem = ({ saksnummer, behandling }: { saksnummer: string; behandling: Behandling }) => {
  return (
    <li>
      <Link
        href={`/aap/mine-aap/nb/oversikt/${saksnummer}/behandling/${behandling.behandlingReferanse}`}
        className={styles.link}
      >
        {behandling.behandlingType}
      </Link>
      <BodyLong size="medium">{`Ferdig behandlet: `}</BodyLong>
    </li>
  );
};
