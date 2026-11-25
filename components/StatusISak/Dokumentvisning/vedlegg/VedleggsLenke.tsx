'use client';

import { Detail } from '@navikt/ds-react';
import { readableFileSize } from '../readableFilesize';
import styles from './Vedlegg.module.css';

interface VedleggslenkeProps {
  url: string;
  tittel: string;
  filstorrelse: number;
  brukerHarTilgang: boolean;
}

export const VedleggsLenke = ({ url, tittel, brukerHarTilgang, filstorrelse }: VedleggslenkeProps) => {
  const tittelMedPdfTag = `${tittel}.pdf`;

  return brukerHarTilgang ? (
    <div className={styles.container}>
      <div className={styles.linkWIthIcon}>
        <a href={url} className={styles.vedlegg} lang="nb">
          {tittelMedPdfTag}
        </a>
      </div>
      <Detail>{readableFileSize(filstorrelse)}</Detail>
    </div>
  ) : (
    <div className={styles.container}>
      <div className={styles.vedleggIngenTilgang} lang="nb">
        {tittelMedPdfTag}
      </div>
      <Detail>{readableFileSize(filstorrelse)}</Detail>
    </div>
  );
};
