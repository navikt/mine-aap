import styles from './DatoOgReferansenummer.module.css';

const DatoOgReferansenummer = ({ dato, referansenummer }: { dato: string | undefined; referansenummer: string }) => {
  return (
    <dl className={styles.list}>
      <div className={styles.listItem}>
        <dt>Søknad mottatt</dt>
        <dd>{dato ? dato : 'Ukjent'}</dd>
      </div>
      <div className={styles.listItem}>
        <dt>Referansenummer</dt>
        <dd>{referansenummer ? referansenummer : 'Ukjent'}</dd>
      </div>
    </dl>
  );
};

export default DatoOgReferansenummer;
