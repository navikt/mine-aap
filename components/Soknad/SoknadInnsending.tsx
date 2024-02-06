import * as styles from './Soknad.module.css';
import { Alert, BodyShort, Button, Heading } from '@navikt/ds-react';
import { ButtonRow } from 'components/ButtonRow/ButtonRow';
import { DocumentationHeading } from 'components/DocumentationHeading/DocumentationHeading';
import { InnsendingSøknad, MineAapSoknadMedEttersendinger } from 'lib/types/types';
import { formatDate } from 'lib/utils/date';
import { useRouter } from 'next/router';
import { FormattedMessage, useIntl } from 'react-intl';

export const SoknadInnsending = ({
  søknad,
  ettersendelse,
}: {
  søknad: InnsendingSøknad;
  ettersendelse?: MineAapSoknadMedEttersendinger;
}) => {
  const router = useRouter();
  const { formatMessage } = useIntl();

  return (
    <div className={styles.soknad}>
      <Heading level="2" size="medium" style={{ marginBlockEnd: '8px' }}>
        <FormattedMessage id="minSisteSøknad.søknad.heading" />
      </Heading>
      <BodyShort size="small" style={{ color: 'var(--a-text-subtle)', marginBlockEnd: '16px' }}>
        <FormattedMessage id="minSisteSøknad.mottatt" values={{ date: formatDate(søknad.mottattDato) }} />
      </BodyShort>

      <Alert variant="info">
        Hvis du skal ettersende dokumentasjon til søknaden eller NAV har bedt deg sende dokumentasjon, kan du gjøre det
        her. Har vi ikke bedt om dokumentasjon, trenger du ikke sende oss noe.
      </Alert>

      {ettersendelse && ettersendelse.ettersendinger.length > 0 && (
        <DocumentationHeading heading={formatMessage({ id: 'minSisteSøknad.dokumentasjon.mottatt' })} />
      )}
      {ettersendelse?.ettersendinger.map((ettersendelse) => (
        <div key={ettersendelse.innsendingsId}>{ettersendelse.journalpostId}</div>
      ))}

      <ButtonRow>
        <Button variant="primary" onClick={() => router.push(`/${søknad.innsendingsId}/ettersendelse/`)}>
          <FormattedMessage id="minSisteSøknad.søknad.button.text" />
        </Button>
      </ButtonRow>
    </div>
  );
};
