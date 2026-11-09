import { Link } from '@navikt/ds-react';
import { ArrowLeftIcon } from 'node_modules/@navikt/aksel-icons/dist/react/esm';
import styles from './TilbakeLink.module.css';

export const TilbakeLink = () => {
  return (
    <Link href="/aap/mine-aap/nb/oversikt/" className={styles.link}>
      <ArrowLeftIcon title="a11y-title" fontSize="1.5rem" />
      Tilbake til Min Side
    </Link>
  );
};
