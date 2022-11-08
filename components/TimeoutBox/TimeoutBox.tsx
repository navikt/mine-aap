import { Button, Heading, Link, Modal } from '@navikt/ds-react';
import { useFeatureToggleIntl } from 'lib/hooks/useFeatureToggleIntl';
import { useInterval } from 'lib/hooks/useInterval';
import { isMock } from 'lib/utils/environments';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import * as styles from './TimeoutBox.module.css';

const ONE_SECOND_IN_MS = 1000;
const SECONDS_IN_MINUTE = 60;
const SECONDS_IN_HOUR = 60 * 60;

const now = (): number => {
  return new Date().getTime();
};

const beregnUtloggingsTidspunkt = (sessionDurationInSeconds: number): number => {
  const millisekunderTilUtlogging = sessionDurationInSeconds * ONE_SECOND_IN_MS;
  return now() + millisekunderTilUtlogging;
};

export const TimeoutBox = () => {
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [logoutTime, setLogoutTime] = useState(beregnUtloggingsTidspunkt(SECONDS_IN_HOUR));

  const { formatMessage } = useFeatureToggleIntl();

  const router = useRouter();

  useEffect(() => {
    if (isMock()) {
      setLogoutTime(beregnUtloggingsTidspunkt(SECONDS_IN_HOUR));
    } else {
      fetch('/aap/mine-aap/oauth2/session')
        .then((res) => res.json())
        .then((data) => {
          const endsInSeconds = data.session.ends_in_seconds;
          setLogoutTime(beregnUtloggingsTidspunkt(endsInSeconds));
        })
        .catch((err) => console.log(err));
    }
  }, []);

  const onLoginClick = () => {
    router.reload();
  };

  useInterval(() => {
    const tidIgjenAvSesjon = logoutTime - now();
    setIsLoggedOut(tidIgjenAvSesjon < 0);
  }, SECONDS_IN_MINUTE * ONE_SECOND_IN_MS);

  return (
    <Modal
      open={isLoggedOut}
      onClose={() => null}
      shouldCloseOnOverlayClick={false}
      closeButton={false}
    >
      <Modal.Content>
        <Heading level="1" size="large" spacing>
          {formatMessage('logoutModal.title')}
        </Heading>
        <div className={styles.buttonRow}>
          <Button onClick={onLoginClick}>{formatMessage('logoutModal.buttonText')}</Button>
          <Link href="https://www.nav.no">Gå tilbake til nav.no</Link>
        </div>
      </Modal.Content>
    </Modal>
  );
};
