import { Alert, BodyShort, Button, Heading, Link } from '@navikt/ds-react';
import { ButtonRow } from 'components/ButtonRow/ButtonRow';

import { InnsendingSøknad } from 'lib/types/types';
import { formatDate } from 'lib/utils/date';
import { useRouter } from 'next/router';
import { FormattedMessage } from 'react-intl';

export const SoknadInnsending = ({ søknad }: { søknad: InnsendingSøknad }) => {
  const router = useRouter();
  return (
    <div>
      <Heading level="2" size="medium" style={{ marginBlockEnd: '8px' }}>
        <FormattedMessage id="minSisteSøknad.søknad.heading" />
      </Heading>
      <BodyShort size="small" style={{ color: 'var(--a-text-subtle)', marginBlockEnd: '16px' }}>
        <FormattedMessage id="minSisteSøknad.mottatt" values={{ date: formatDate(søknad.mottattDato) }} />
      </BodyShort>
      <Link href="#">Se forventet saksbehandlingstid</Link>
      {søknad.journalpostId && (
        <>
          <Alert variant="info">
            Hvis du skal ettersende dokumentasjon til søknaden eller NAV har bedt deg sende dokumentasjon, kan du gjøre
            det her. Har vi ikke bedt om dokumentasjon, trenger du ikke sende oss noe.
          </Alert>
          {/* TODO: Hente dokumenter som er journalført med samme referanse */}
          {/* TODO: Hente søknad JSON og vise dokumentkrav til søknaden */}
          <ButtonRow>
            <Button variant="primary" onClick={() => router.push(`/${søknad.journalpostId}/ettersendelse/`)}>
              <FormattedMessage id="minSisteSøknad.søknad.button.text" />
            </Button>
          </ButtonRow>
        </>
      )}
    </div>
  );
};
