import type { Behandling } from 'lib/services/apiInternService';
import { BodyLong, Heading, Link } from 'node_modules/@navikt/ds-react';
import styles from './BehandlingerList.module.css';

//TODO: DokumentList og BehandlingerList bør kanskje slås sammen, da utseende er likt med unntak av inngress

export const BehandlingerList = ({ behandlinger }: { behandlinger: { data: Behandling[] } }) => {
  return (
    <section>
      <Heading level="2" size="medium" className={styles.heading}>
        Tidligere behandlinger
      </Heading>
      <ul className={styles.list}>
        {behandlinger.data
          .filter((behandling) => behandling.vedtakFattet)
          .map((behandling) => (
            <BehandlingsItem key={behandling.behandlingId} behandling={behandling} />
          ))}
      </ul>
    </section>
  );
};

const BehandlingsItem = ({ behandling }: { behandling: Behandling }) => {
  return (
    <li>
      <Link href={`/aap/mine-aap/nb/oversikt/behandling/${behandling.behandlingId}`} className={styles.link}>
        {behandling.navn}
      </Link>
      <BodyLong size="medium">{`Ferdig behandlet: ${behandling.vedtakFattetDato}`}</BodyLong>
    </li>
  );
};
