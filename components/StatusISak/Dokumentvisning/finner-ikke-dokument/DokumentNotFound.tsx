import { BodyShort } from '@navikt/ds-react';
import { useTranslations } from 'next-intl';
import styles from './DokumentNotFound.module.css';

const DokumentNotFound = () => {
  const t = useTranslations('statusisak.hendelse.dokument');

  return (
    <div className={styles.container}>
      <BodyShort size="medium">{t('finnerIkkeDokument')}</BodyShort>
    </div>
  );
};

export default DokumentNotFound;
