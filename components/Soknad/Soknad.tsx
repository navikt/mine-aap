import * as styles from './Soknad.module.css';
import { Alert, BodyShort, Button, Heading } from '@navikt/ds-react';
import { ButtonRow } from 'components/ButtonRow/ButtonRow';
import { DocumentationHeading } from 'components/DocumentationHeading/DocumentationHeading';
import { DocumentationList } from 'components/DocumentationList/DocumentationList';
import { Søknad } from 'lib/types/types';
import { formatDate } from 'lib/utils/date';
import { useRouter } from 'next/router';
import { FormattedMessage, useIntl } from 'react-intl';

export const Soknad = ({ søknad }: { søknad: Søknad }) => {
  const { formatMessage } = useIntl();
  const router = useRouter();

  return (
    <div className={styles.soknad}>
      <Heading level="2" size="medium" style={{ marginBlockEnd: '8px' }}>
        <FormattedMessage id="minSisteSøknad.søknad.heading" />
      </Heading>
      <BodyShort size="small" style={{ color: 'var(--a-text-subtle)', marginBlockEnd: '16px' }}>
        <FormattedMessage
          id="minSisteSøknad.mottatt"
          values={{ date: formatDate(søknad.innsendtDato) }}
        />
      </BodyShort>
      {søknad.manglendeVedlegg?.length && (
        <>
          <Alert variant="warning" size="small" className={styles.alert}>
            <FormattedMessage id="minSisteSøknad.søknad.alert.message" />
          </Alert>
          <DocumentationHeading
            heading={formatMessage({ id: 'minSisteSøknad.dokumentasjon.mangler' })}
          />

          <ul className={styles.dokumentasjonManglerList}>
            {søknad.manglendeVedlegg.map((vedlegg) => {
              return (
                <li key={vedlegg}>
                  {formatMessage({ id: `ettersendelse.vedleggstyper.${vedlegg}.heading` })}
                </li>
              );
            })}
          </ul>
        </>
      )}

      <ButtonRow>
        <Button variant="primary" onClick={() => router.push(`/${søknad.søknadId}/ettersendelse/`)}>
          <FormattedMessage id="minSisteSøknad.søknad.button.text" />
        </Button>
      </ButtonRow>
      {søknad.innsendteVedlegg?.length && (
        <>
          <DocumentationHeading
            heading={formatMessage({ id: 'minSisteSøknad.dokumentasjon.mottatt' })}
          />
          <DocumentationList
            elements={søknad.innsendteVedlegg.map((vedlegg) => {
              return {
                tittel: vedlegg.tittel,
                href: `/aap/mine-aap/api/dokument/?journalpostId=${vedlegg.journalpostId}&dokumentId=${vedlegg.dokumentId}`,
                innsendt: vedlegg.dato,
              };
            })}
          />
        </>
      )}
    </div>
  );
};
