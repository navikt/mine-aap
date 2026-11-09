import type { DokumentProps } from '../JournalpostInterfaces';
import { Detail, Heading } from '@navikt/ds-react';
import { readableFileSize } from '../readableFilesize';
import styles from './Vedlegg.module.css';

interface Props {
  vedleggsListe: DokumentProps[] | undefined;
  journalpostId: string | undefined;
}

interface VedleggslenkeProps {
  url: string;
  tittel: string;
  filstorrelse: number;
  brukerHarTilgang: boolean;
}

//TODO: Avklare hvordan vedlegg skal håndteres og vises

const Vedlegg = ({ vedleggsListe, journalpostId }: Props) => {
  const baseUrl = 'api/dokument/vedlegg'; //`${dokumentUrl}/${journalpostId}`;
  const hasVedlegg = vedleggsListe && vedleggsListe.length > 0;

  const VedleggsLenke = ({ url, tittel, brukerHarTilgang, filstorrelse }: VedleggslenkeProps) => {
    const tittelMedPdfTag = tittel + '.pdf';

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

  return hasVedlegg ? (
    <>
      <div className={styles.title}>
        <Heading level="2" size="xsmall">
          Vedlegg
        </Heading>
      </div>
      {vedleggsListe?.map((vedlegg: DokumentProps) => (
        <VedleggsLenke
          url={`${baseUrl}/${vedlegg.dokumentInfoId}`}
          tittel={vedlegg.tittel}
          brukerHarTilgang={vedlegg.brukerHarTilgang}
          filstorrelse={vedlegg.filstorrelse}
          key={vedlegg.dokumentInfoId}
        />
      ))}
    </>
  ) : null;
};

export default Vedlegg;
