import { formatMessage } from '@formatjs/intl';
import { Heading, Panel, BodyShort, Alert, Button } from '@navikt/ds-react';
import { useFeatureToggleIntl } from 'lib/hooks/useFeatureToggleIntl';
import { Søknad } from 'lib/types/types';
import { formatFullDate } from 'lib/utils/date';
import Link from 'next/link';
import router from 'next/router';
import * as styles from 'components/SoknadPanel/SoknadPanel.module.css';

interface Props {
  søknad: Søknad;
}

export const SoknadPanel = ({ søknad }: Props) => {
  const { formatMessage } = useFeatureToggleIntl();

  return (
    <Panel border>
      <Heading level="3" size="small">
        {formatMessage('sisteSøknad.søknad.heading')}
      </Heading>
      <BodyShort spacing>
        {formatMessage('sisteSøknad.søknad.mottatt', {
          date: formatFullDate(søknad.innsendtDato),
        })}
      </BodyShort>
      <BodyShort spacing>
        <Link href="#">{formatMessage('sisteSøknad.søknad.saksbehandlingstid')}</Link>
      </BodyShort>
      {(søknad.manglendeVedlegg?.length ?? 0) > 0 && (
        <Alert variant="warning">
          {formatMessage('sisteSøknad.søknad.alert.message', {
            missingDocuments: søknad.manglendeVedlegg
              ?.map((type) => formatMessage(`ettersendelse.vedleggstyper.${type}.heading`))
              .join(', '),
          })}
        </Alert>
      )}
      <div className={styles.ettersendButton}>
        <Button variant="primary" onClick={() => router.push(`/${søknad.søknadId}/ettersendelse/`)}>
          {formatMessage('sisteSøknad.søknad.button.text')}
        </Button>
      </div>
      <Heading level="3" size="small">
        {formatMessage('sisteSøknad.dokumentasjon.heading')}
      </Heading>
      <ul>
        {søknad.innsendteVedlegg?.map((document) => (
          <li key={`${document.vedleggType}-${document.innsendtDato}`}>
            {formatMessage('sisteSøknad.dokumentasjon.vedlegg', {
              date: formatFullDate(document.innsendtDato),
              type: formatMessage(`ettersendelse.vedleggstyper.${document.vedleggType}.heading`),
            })}
          </li>
        ))}
      </ul>
    </Panel>
  );
};
