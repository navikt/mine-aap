import { Alert, BodyLong, BodyShort, Button, Detail, Heading, Label, Link } from '@navikt/ds-react';
import { ButtonRow } from 'components/ButtonRow/ButtonRow';
import { CardDivider } from 'components/Card/CardDivider';
import { DocumentationHeading } from 'components/DocumentationHeading/DocumentationHeading';
import { DocumentationList } from 'components/DocumentationList/DocumentationList';
import * as styles from './Soknad.module.css';

export const Soknad = () => {
  return (
    <div className={styles.soknad}>
      <Heading level="2" size="medium" style={{ marginBlockEnd: '8px' }}>
        Arbeidsavklarings&shy;penger (AAP)
      </Heading>
      <BodyShort size="small" style={{ color: 'var(--a-text-subtle)', marginBlockEnd: '16px' }}>
        Mottatt: 9. januar 2023
      </BodyShort>
      <Alert variant="warning" size="small">
        Vi mangler dokumentasjon fra deg for å kunne behandle søknaden. Ettersend dette til oss så
        raskt du kan.
      </Alert>
      <CardDivider />

      <DocumentationHeading heading="Dokumentasjon vi mangler" />
      <DocumentationList
        elements={[
          { tittel: 'Dokumentasjon fra arbeidsgiver' },
          { tittel: 'Bekreftelse på avbrutt studie' },
        ]}
      />

      <ButtonRow>
        <Button variant="primary">Ettersend dokumentasjon</Button>
      </ButtonRow>
      <DocumentationHeading heading="Dette har vi mottatt fra deg" />
      <DocumentationList
        elements={[
          { tittel: 'Søknad om AAP', href: '#', innsendt: new Date() },
          { tittel: 'Dokumentasjon på sykepenger', href: '#', innsendt: new Date() },
          { tittel: 'Dokumentasjon fra barnevern', href: '#', innsendt: new Date() },
        ]}
      />
    </div>
  );
};
