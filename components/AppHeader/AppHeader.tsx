import { Heading } from '@navikt/ds-react';
import { useFeatureToggleIntl } from 'lib/hooks/useFeatureToggleIntl';
import styles from 'components/AppHeader/AppHeader.module.css';

export const AppHeader = () => {
  const intl = useFeatureToggleIntl();

  return (
    <header className={styles.appHeader}>
      <div className={styles.container}>
        <Heading level="1" size="xlarge">
          {intl.formatMessage('appTittel')}
        </Heading>
      </div>
    </header>
  );
};
