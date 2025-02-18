import { Heading } from '@navikt/ds-react';
import styles from 'components/AppHeader/AppHeader.module.css';
import { useTranslations } from 'next-intl';

export const AppHeader = () => {
  const t = useTranslations();

  return (
    <header className={styles.appHeader}>
      <div className={styles.container}>
        <Heading level="1" size="xlarge">
          {t('appTittelMedSkille')}
        </Heading>
      </div>
    </header>
  );
};
