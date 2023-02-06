import { Heading } from '@navikt/ds-react';
import styles from 'components/AppHeader/AppHeader.module.css';
import { FormattedMessage } from 'react-intl';

export const AppHeader = () => {
  return (
    <header className={styles.appHeader}>
      <div className={styles.container}>
        <Heading level="1" size="xlarge">
          <FormattedMessage
            id="appTittel"
            values={{
              shy: <>&shy;</>,
            }}
          />
        </Heading>
      </div>
    </header>
  );
};
