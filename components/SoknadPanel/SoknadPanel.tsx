import { Alert, BodyShort, Button, Heading, Label, Link, Panel } from '@navikt/ds-react';
import { Søknad } from 'lib/types/types';
import { formatFullDate } from 'lib/utils/date';
import router from 'next/router';
import NextLink from 'next/link';
import * as styles from 'components/SoknadPanel/SoknadPanel.module.css';
import { useIntl } from 'react-intl';

interface Props {
  søknad: Søknad;
}

export const SoknadPanel = ({ søknad }: Props) => {
  const { formatMessage } = useIntl();

  return (
    <Panel className={styles.panel}>
      <Heading level="3" size="small">
        {formatMessage({ id: 'sisteSøknad.søknad.heading' })}
      </Heading>
      <BodyShort spacing>
        {formatMessage(
          { id: 'sisteSøknad.søknad.mottatt' },
          {
            date: formatFullDate(søknad.innsendtDato),
          }
        )}
      </BodyShort>
      <BodyShort spacing>
        <Link target="_blank" href="https://www.nav.no/saksbehandlingstider#arbeidsavklaringspenger-aap">
          {formatMessage({ id: 'sisteSøknad.søknad.saksbehandlingstid' })}
        </Link>
      </BodyShort>
      {(søknad.manglendeVedlegg?.length ?? 0) > 0 && (
        <div className={styles.alert}>
          <Alert variant="warning">{formatMessage({ id: 'sisteSøknad.søknad.alert.message' })}</Alert>
        </div>
      )}

      {(søknad.innsendteVedlegg?.length ?? 0) > 0 && (
        <>
          <Label as="p">{formatMessage({ id: 'sisteSøknad.dokumentasjon.mottatt' })}</Label>
          <ul>
            {søknad.innsendteVedlegg?.map((krav) => (
              <li key={krav.innsendingsId}>
                <NextLink
                  href={`/api/dokument/?journalpostId=${krav.journalpostId}&dokumentId=${krav.dokumentId}`}
                  target="_blank"
                >
                  {krav.tittel}
                </NextLink>
              </li>
            ))}
          </ul>
        </>
      )}
      {(søknad.manglendeVedlegg?.length ?? 0) > 0 && (
        <>
          <Label>{formatMessage({ id: 'sisteSøknad.dokumentasjon.mangler' })}</Label>
          <ul>
            {søknad.manglendeVedlegg?.map((krav) => (
              <li key={krav}>{formatMessage({ id: `ettersendelse.vedleggstyper.${krav}.heading` })}</li>
            ))}
          </ul>
        </>
      )}

      <Button variant="primary" onClick={() => router.push(`/${søknad.søknadId}/ettersendelse/`)}>
        {formatMessage({ id: 'sisteSøknad.søknad.button.text' })}
      </Button>
    </Panel>
  );
};
