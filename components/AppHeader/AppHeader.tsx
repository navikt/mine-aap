import { Heading } from '@navikt/ds-react';
import styles from 'components/AppHeader/AppHeader.module.css';
import { useIntl } from 'react-intl';

export const AppHeader = () => {
  const { formatMessage } = useIntl();

  return (
    <header className={styles.appHeader}>
      <div className={styles.container}>
        <Heading level="1" size="xlarge">
          {formatMessage(
            { id: 'appTittel' },
            {
              shy: <>&shy;</>,
            }
          )}
        </Heading>
      </div>
    </header>
  );
};
