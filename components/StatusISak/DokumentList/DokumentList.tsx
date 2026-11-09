import type { Dokument } from 'lib/types/types';
import { Link, BodyLong, Heading, Button } from 'node_modules/@navikt/ds-react';
import { UploadIcon } from 'node_modules/@navikt/aksel-icons/dist/react/esm';
import styles from './DokumentList.module.css';

//TODO: avklare dokument-json felter

export const DokumentList = ({ dokument }: { dokument: { data: Dokument[] } }) => {
  return (
    <section>
      <Heading level="2" size="medium" className={styles.heading}>
        Søknad og vedlegg
      </Heading>
      <ul className={styles.list}>
        {dokument.data.map((dok) => (
          <DokumentItem key={dok.tittel} dokument={dok} />
        ))}
      </ul>
      <Button variant="secondary" icon={<UploadIcon aria-hidden />} className={styles.button}>
        Last opp
      </Button>
    </section>
  );
};

const DokumentItem = ({ dokument }: { dokument: Dokument }) => {
  return (
    <li>
      <Link href={`/aap/mine-aap/nb/oversikt/dokumenter`} className={styles.link}>
        {dokument.tittel}
      </Link>
      <BodyLong
        size="medium"
        className={styles.ingress}
      >{`Ferdig behandlet: ${dokument.dato} - Navn Navnesen`}</BodyLong>
    </li>
  );
};
