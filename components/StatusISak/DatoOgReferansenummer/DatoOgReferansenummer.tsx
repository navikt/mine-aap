import styles from './DatoOgReferansenummer.module.css';

const DatoOgReferansenummer = ({ dato, referansenummer }: { dato: string; referansenummer: string }) => {
  return (
    <dl className={styles.list}>
      <div className={styles.listItem}>
        <dt>Søknad mottatt</dt>
        <dd>{dato}</dd>
      </div>
      <div className={styles.listItem}>
        <dt>Referansenummer</dt>
        <dd>{referansenummer}</dd>
      </div>
    </dl>
  );
};

export default DatoOgReferansenummer;
