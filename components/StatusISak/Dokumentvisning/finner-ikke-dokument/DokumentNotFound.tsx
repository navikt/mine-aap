import { BodyShort } from '@navikt/ds-react';
import styles from './DokumentNotFound.module.css';

const DokumentNotFound = () => {
  return (
    <div className={styles.container}>
      <BodyShort size="medium">Kunne ikke finne dokument </BodyShort>
    </div>
  );
};

export default DokumentNotFound;
