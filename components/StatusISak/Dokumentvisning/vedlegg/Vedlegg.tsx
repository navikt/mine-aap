import { Heading } from '@navikt/ds-react';
import { VedleggsLenke } from 'components/StatusISak/Dokumentvisning/vedlegg/VedleggsLenke';
import type { DokumentProps } from '../JournalpostInterfaces';
import styles from './Vedlegg.module.css';

interface Props {
  vedleggsListe: DokumentProps[] | undefined;
  journalpostId: string | undefined;
}

//TODO: Avklare hvordan vedlegg skal håndteres og vises

const Vedlegg = ({ vedleggsListe }: Props) => {
  const baseUrl = 'api/dokument/vedlegg'; //`${dokumentUrl}/${journalpostId}`;
  const hasVedlegg = vedleggsListe && vedleggsListe.length > 0;

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
