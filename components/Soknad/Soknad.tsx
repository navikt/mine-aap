import { Alert, BodyShort, Button, Heading } from '@navikt/ds-react';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { Søknad } from 'lib/types/types';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';

import { ButtonRow } from 'components/ButtonRow/ButtonRow';
import { DocumentationHeading } from 'components/DocumentationHeading/DocumentationHeading';
import { DocumentationList } from 'components/DocumentationList/DocumentationList';

import * as styles from './Soknad.module.css';

export const Soknad = ({ søknad }: { søknad: Søknad }) => {
  const { formatMessage } = useIntl();
  const router = useRouter();

  return (
    <div className={styles.soknad}>
      <Heading level="2" size="medium" style={{ marginBlockEnd: '8px' }}>
        Arbeidsavklarings&shy;penger (AAP)
      </Heading>
      <BodyShort size="small" style={{ color: 'var(--a-text-subtle)', marginBlockEnd: '16px' }}>
        Mottatt: {format(new Date(søknad.innsendtDato), 'dd. MMMM yyyy', { locale: nb })}
      </BodyShort>
      {søknad.manglendeVedlegg?.length && (
        <>
          <Alert variant="warning" size="small" className={styles.alert}>
            Vi mangler dokumentasjon fra deg for å kunne behandle søknaden. Ettersend dette til oss så raskt du kan.
          </Alert>
          <DocumentationHeading heading="Dokumentasjon vi mangler" />

          <ul>
            {søknad.manglendeVedlegg.map((vedlegg) => {
              return <li key={vedlegg}>{formatMessage({ id: `ettersendelse.vedleggstyper.${vedlegg}.heading` })}</li>;
            })}
          </ul>
        </>
      )}

      <ButtonRow>
        <Button variant="primary" onClick={() => router.push(`/${søknad.søknadId}/ettersendelse/`)}>
          Ettersend dokumentasjon
        </Button>
      </ButtonRow>
      {søknad.innsendteVedlegg?.length && (
        <>
          <DocumentationHeading heading="Dette har vi mottatt fra deg" />
          <DocumentationList
            elements={søknad.innsendteVedlegg.map((vedlegg) => {
              return {
                tittel: vedlegg.tittel,
                href: `/aap/mine-aap/api/dokument/?journalpostId=${vedlegg.journalpostId}&dokumentId=${vedlegg.dokumentId}`,
                innsendt: new Date(vedlegg.dato),
              };
            })}
          />
        </>
      )}
    </div>
  );
};
