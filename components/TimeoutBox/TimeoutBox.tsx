import { BodyShort, Button, Heading, Modal } from '@navikt/ds-react';
import { useInterval } from 'lib/hooks/useInterval';
import { isMock } from 'lib/utils/environments';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const ONE_SECOND_IN_MS = 1000;

const now = (): number => {
  return new Date().getTime();
};

const beregnUtloggingsTidspunkt = (sessionDurationInSeconds: number): number => {
  const millisekunderTilUtlogging = sessionDurationInSeconds * ONE_SECOND_IN_MS;
  return now() + millisekunderTilUtlogging;
};

export const TimeoutBox = () => {
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [logoutTime, setLogoutTime] = useState(
    beregnUtloggingsTidspunkt(60 * 60 * ONE_SECOND_IN_MS)
  );

  const router = useRouter();

  useEffect(() => {
    if (isMock()) {
      setLogoutTime(beregnUtloggingsTidspunkt(60 * ONE_SECOND_IN_MS));
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
    console.log('tidigjentillogout', tidIgjenAvSesjon);
    setIsLoggedOut(tidIgjenAvSesjon < 0);
  }, 60 * ONE_SECOND_IN_MS);

  return (
    <Modal
      open={isLoggedOut}
      onClose={() => null}
      shouldCloseOnOverlayClick={false}
      closeButton={false}
    >
      <Modal.Content>
        <Heading level="1" size="large" spacing>
          Du har blitt logget ut
        </Heading>
        <BodyShort spacing>Trykk på knappen under for å logge inn på nytt.</BodyShort>
        <Button onClick={onLoginClick}>Logg inn på nytt</Button>
      </Modal.Content>
    </Modal>
  );
};
