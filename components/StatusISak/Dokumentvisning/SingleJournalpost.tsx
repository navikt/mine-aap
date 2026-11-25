import { BodyShort, Heading } from '@navikt/ds-react';
import { HovedDokument } from 'components/StatusISak/Dokumentvisning/HovedDokument';
import { format } from 'date-fns';
import { useTranslations } from 'next-intl';
import DokumentNotFound from './finner-ikke-dokument/DokumentNotFound';
import type { JournalpostProps } from './JournalpostInterfaces';
import styles from './SingleJournalpost.module.css';
import { setAvsenderMottaker } from './setAvsenderMottaker';
import Vedlegg from './vedlegg/Vedlegg';

interface Props {
  journalpost: JournalpostProps;
}

//TODO: Avklare om vi vil ha identisk funksjonalitet som dokumentarkiv sin enkeltvisning, samt fikse json struktur og endepunkter deretter
//TODO: Splitte opp komponent i mindre mer håndterbare komponenter
const SingleJournalpost = ({ journalpost }: Props) => {
  const t = useTranslations('statusisak.hendelse.dokument');

  if (!journalpost) {
    return <DokumentNotFound />;
  }

  const tilgangsSperreInfo = () => {
    if (journalpost.dokument.tilgangssperre === null) return null;
    if (journalpost.dokument.tilgangssperre === 'SkannetDokument')
      return (
        <div className={styles.tilgangssperre}>
          <span className={styles.tilgangssperre}>{t('tilgangssperreSkannet')}</span>
        </div>
      );
    if (journalpost.dokument.tilgangssperre === 'Tredjepart')
      return (
        <div className={styles.tilgangssperre}>
          <span>{t('tilgangssperreTredjepart')}</span>
        </div>
      );
    if (journalpost.dokument.tilgangssperre === 'Annet')
      return (
        <div className={styles.tilgangssperre}>
          <span>{t('tilgangssperreAnnet')}</span>
        </div>
      );
  };

  const hovedDokumentUrl = `api/journalpost/${journalpost.journalpostId}/${journalpost.dokument.dokumentInfoId}`;
  const avsenderText = setAvsenderMottaker(journalpost);
  const dato = format(new Date(journalpost.opprettet), 'dd.MM.yyyy');
  const veddleggsListe = journalpost.vedlegg;
  const isInngaaendeJournalpost = journalpost.journalposttype.toLowerCase() === 'inn';

  return (
    <>
      <Heading level="1" size="large" lang="nb">
        {journalpost?.tittel}
      </Heading>
      <HovedDokument journalpost={journalpost} hovedDokumentUrl={hovedDokumentUrl} />
      <div className={styles.temalenke}>{tilgangsSperreInfo()}</div>
      <div className={styles.details}>
        <div className={styles.detailTitle}>
          <Heading level="2" size="xsmall">
            {t('detaljerTitle')}
          </Heading>
        </div>
        <div className={styles.detail}>
          <BodyShort size="medium">{t(isInngaaendeJournalpost ? 'sendtInnTitle' : 'sendtTilTitle')}</BodyShort>
          <BodyShort size="medium">{avsenderText}</BodyShort>
        </div>
        <div className={styles.detail}>
          <BodyShort size="medium">{t('datoTitle')}</BodyShort>
          <BodyShort size="medium">{dato}</BodyShort>
        </div>
        <div className={styles.detail}>
          <BodyShort size="medium">{t('temaTitle')}</BodyShort>
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
