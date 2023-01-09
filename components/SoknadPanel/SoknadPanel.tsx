import { Heading, Panel, BodyShort, Alert, Button, Label, Link } from '@navikt/ds-react';
import { useFeatureToggleIntl } from 'lib/hooks/useFeatureToggleIntl';
import { Søknad } from 'lib/types/types';
import { formatFullDate } from 'lib/utils/date';
import router from 'next/router';
import NextLink from 'next/link';
import * as styles from 'components/SoknadPanel/SoknadPanel.module.css';

interface Props {
  søknad: Søknad;
}

export const SoknadPanel = ({ søknad }: Props) => {
  const { formatMessage } = useFeatureToggleIntl();

  return (
    <Panel className={styles.panel}>
      <Heading level="3" size="small">
        {formatMessage('sisteSøknad.søknad.heading')}
      </Heading>
      {/*<BodyShort spacing>
        {formatMessage('sisteSøknad.søknad.mottatt', {
          date: formatFullDate(søknad.innsendtDato),
        })}
      </BodyShort>*/}
      <BodyShort spacing>
        <Link
          target="_blank"
          href="https://www.nav.no/saksbehandlingstider#arbeidsavklaringspenger-aap"
        >
          {formatMessage('sisteSøknad.søknad.saksbehandlingstid')}
        </Link>
      </BodyShort>
      {(søknad.manglendeVedlegg?.length ?? 0) > 0 && (
        <div className={styles.alert}>
          <Alert variant="warning">{formatMessage('sisteSøknad.søknad.alert.message')}</Alert>
        </div>
      )}

      {(søknad.innsendteVedlegg?.length ?? 0) > 0 && (
        <>
          <Label as="p">{formatMessage('sisteSøknad.dokumentasjon.mottatt')}</Label>
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
          <Label>{formatMessage('sisteSøknad.dokumentasjon.mangler')}</Label>
          <ul>
            {søknad.manglendeVedlegg?.map((krav) => (
              <li key={krav}>{formatMessage(`ettersendelse.vedleggstyper.${krav}.heading`)}</li>
            ))}
          </ul>
        </>
      )}

      <Button variant="primary" onClick={() => router.push(`/${søknad.søknadId}/ettersendelse/`)}>
        {formatMessage('sisteSøknad.søknad.button.text')}
      </Button>
    </Panel>
  );
};
