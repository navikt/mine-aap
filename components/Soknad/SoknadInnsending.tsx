import * as styles from './Soknad.module.css';
import { BodyShort, Button, Heading } from '@navikt/ds-react';
import { ButtonRow } from 'components/ButtonRow/ButtonRow';
import { InnsendingSøknad } from 'lib/types/types';
import { formatDate } from 'lib/utils/date';
import { useRouter } from 'next/router';
import { FormattedMessage } from 'react-intl';

export const SoknadInnsending = ({ søknad }: { søknad: InnsendingSøknad }) => {
  const router = useRouter();

  return (
    <div className={styles.soknad}>
      <Heading level="2" size="medium" style={{ marginBlockEnd: '8px' }}>
        <FormattedMessage id="minSisteSøknad.søknad.heading" />
      </Heading>
      <BodyShort size="small" style={{ color: 'var(--a-text-subtle)', marginBlockEnd: '16px' }}>
        <FormattedMessage id="minSisteSøknad.mottatt" values={{ date: formatDate(søknad.mottattDato) }} />
      </BodyShort>

      <ButtonRow>
        <Button variant="primary" onClick={() => router.push(`/${søknad.innsendingsId}/ettersendelse/`)}>
          <FormattedMessage id="minSisteSøknad.søknad.button.text" />
        </Button>
      </ButtonRow>
    </div>
  );
};
