import { EyeSlashIcon, FilePdfIcon } from '@navikt/aksel-icons';
import { BodyShort, Detail } from '@navikt/ds-react';
import type { JournalpostProps } from 'components/StatusISak/Dokumentvisning/JournalpostInterfaces';
import { readableFileSize } from 'components/StatusISak/Dokumentvisning/readableFilesize';
import styles from './SingleJournalpost.module.css';

interface Props {
  journalpost: JournalpostProps;
  hovedDokumentUrl: string;
}
export const HovedDokument = ({ journalpost, hovedDokumentUrl }: Props) => {
  return (
    <>
      {journalpost?.dokument.brukerHarTilgang ? (
        <div className={`${styles.container} ${styles.hover}`}>
          <div className={styles.icon}>
            <FilePdfIcon fontSize="1.5rem" />
          </div>
          <div className={styles.content}>
            <a className={styles.link} href={hovedDokumentUrl} lang="nb">
              <BodyShort size="medium">{`Åpne ${journalpost?.dokument.tittel.toLowerCase()}`}</BodyShort>
            </a>
            <Detail>{readableFileSize(journalpost.dokument.filstorrelse)}</Detail>
          </div>
        </div>
      ) : (
        <div className={`${styles.container} ${styles.kanIkkeVises} ${styles.hover}`}>
          <div className={`${styles.icon} ${styles.iconKanIkkeVises}`}>
            <EyeSlashIcon fontSize="1.5rem" />
          </div>
          <div className={styles.content}>
            <div className={styles.tittelIkkeTilgang}>
              <BodyShort size="medium" lang="nb">
                {journalpost?.dokument.tittel}
              </BodyShort>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
