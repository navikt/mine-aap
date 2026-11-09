import type { JournalpostProps } from './JournalpostInterfaces';
import { EyeSlashIcon, FilePdfIcon } from '@navikt/aksel-icons';
import { BodyShort, Detail, Heading } from '@navikt/ds-react';
import { setAvsenderMottaker } from './setAvsenderMottaker';
import { readableFileSize } from './readableFilesize';
import { format } from 'date-fns';
import DokumentNotFound from './finner-ikke-dokument/DokumentNotFound';
import styles from './SingleJournalpost.module.css';
import Vedlegg from './vedlegg/Vedlegg';

interface Props {
  journalpost: JournalpostProps;
}

//TODO: Avklare om vi vil ha identisk funksjonalitet som dokumentarkiv sin enkeltvisning, samt fikse json struktur og endepunkter deretter
//TODO: Splitte opp komponent i mindre mer håndterbare komponenter
const SingleJournalpost = ({ journalpost }: Props) => {
  if (!journalpost) {
    return <DokumentNotFound />;
  }

  const tilgangsSperreInfo = () => {
    if (journalpost.dokument.tilgangssperre === null) return null;
    if (journalpost.dokument.tilgangssperre === 'SkannetDokument')
      return (
        <div className={styles.tilgangssperre}>
          <span className={styles.tilgangssperre}>Du får ikke åpnet dokumenter du har sendt i papirpost.</span>
        </div>
      );
    if (journalpost.dokument.tilgangssperre === 'Tredjepart')
      return (
        <div className={styles.tilgangssperre}>
          <span>Du får ikke åpnet dette dokumentet fordi det er sendt av noen andre enn deg.</span>
        </div>
      );
    if (journalpost.dokument.tilgangssperre === 'Annet')
      return (
        <div className={styles.tilgangssperre}>
          <span>Du får ikke åpnet dette dokumentet.</span>
        </div>
      );
  };

  const hovedDokumentUrl = `api/journalpost/${journalpost.journalpostId}/${journalpost.dokument.dokumentInfoId}`;
  const avsenderText = setAvsenderMottaker(journalpost);
  const dato = format(new Date(journalpost.opprettet), 'dd.MM.yyyy');
  const veddleggsListe = journalpost.vedlegg;
  const isInngaaendeJournalpost = journalpost.journalposttype.toLowerCase() === 'inn';

  const HovedDokument = () => {
    return (
      <>
        {journalpost?.dokument.brukerHarTilgang ? (
          <div className={`${styles.container} ${styles.hover}`}>
            <div className={styles.icon}>
              <FilePdfIcon fontSize="1.5rem" />
            </div>
            <div className={styles.content}>
              <a className={styles.link} href={hovedDokumentUrl} lang="nb">
                <BodyShort size="medium">{'Åpne ' + journalpost?.dokument.tittel.toLowerCase()}</BodyShort>
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

  return (
    <>
      <Heading level="1" size="large" lang="nb">
        {journalpost?.tittel}
      </Heading>
      <HovedDokument />
      <div className={styles.temalenke}>{tilgangsSperreInfo()}</div>
      <div className={styles.details}>
        <div className={styles.detailTitle}>
          <Heading level="2" size="xsmall">
            Detaljer
          </Heading>
        </div>
        <div className={styles.detail}>
          <BodyShort size="medium">{isInngaaendeJournalpost ? 'Sendt inn av' : 'Sendt til'}</BodyShort>
          <BodyShort size="medium">{avsenderText}</BodyShort>
        </div>
        <div className={styles.detail}>
          <BodyShort size="medium">Dato opprettet</BodyShort>
          <BodyShort size="medium">{dato}</BodyShort>
        </div>
        <div className={styles.detail}>
          <BodyShort size="medium">Tema</BodyShort>
          <BodyShort size="medium" lang="nb">
            {journalpost?.temanavn}
          </BodyShort>
        </div>
      </div>
      <div className={styles.vedlegg}>
        <Vedlegg vedleggsListe={veddleggsListe} journalpostId={journalpost?.journalpostId} />
      </div>
    </>
  );
};

export default SingleJournalpost;
