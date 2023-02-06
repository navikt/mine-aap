import { Heading, Panel, BodyShort, Alert, Button, Label, Link } from '@navikt/ds-react';
import { Søknad } from 'lib/types/types';
import { formatFullDate } from 'lib/utils/date';
import router from 'next/router';
import NextLink from 'next/link';
import * as styles from 'components/SoknadPanel/SoknadPanel.module.css';
import { FormattedMessage } from 'react-intl';

interface Props {
  søknad: Søknad;
}

export const SoknadPanel = ({ søknad }: Props) => {
  return (
    <Panel className={styles.panel}>
      <Heading level="3" size="small">
        <FormattedMessage id="sisteSøknad.søknad.heading" />
      </Heading>
      <BodyShort spacing>
        <FormattedMessage
          id="sisteSøknad.søknad.mottatt"
          values={{
            date: formatFullDate(søknad.innsendtDato),
          }}
        />
      </BodyShort>
      <BodyShort spacing>
        <Link
          target="_blank"
          href="https://www.nav.no/saksbehandlingstider#arbeidsavklaringspenger-aap"
        >
          <FormattedMessage id="sisteSøknad.søknad.saksbehandlingstid" />
        </Link>
      </BodyShort>
      {(søknad.manglendeVedlegg?.length ?? 0) > 0 && (
        <div className={styles.alert}>
          <Alert variant="warning">
            <FormattedMessage id="sisteSøknad.søknad.alert.message" />
          </Alert>
        </div>
      )}

      {(søknad.innsendteVedlegg?.length ?? 0) > 0 && (
        <>
          <Label as="p">
            <FormattedMessage id="sisteSøknad.dokumentasjon.mottatt" />
          </Label>
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
          <Label>
            <FormattedMessage id="sisteSøknad.dokumentasjon.mangler" />
          </Label>
          <ul>
            {søknad.manglendeVedlegg?.map((krav) => (
              <li key={krav}>
                <FormattedMessage id={`ettersendelse.vedleggstyper.${krav}.heading`} />
              </li>
            ))}
          </ul>
        </>
      )}

      <Button variant="primary" onClick={() => router.push(`/${søknad.søknadId}/ettersendelse/`)}>
        <FormattedMessage id="sisteSøknad.søknad.button.text" />
      </Button>
    </Panel>
  );
};
