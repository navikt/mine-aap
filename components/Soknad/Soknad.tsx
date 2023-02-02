import { Alert, BodyLong, BodyShort, Button, Detail, Heading, Label, Link } from '@navikt/ds-react';
import { ButtonRow } from 'components/ButtonRow/ButtonRow';
import { CardDivider } from 'components/Card/CardDivider';
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
      <Label as="p" spacing>
        Dokumentasjon vi har mottatt
      </Label>
      <ul>
        <li>
          <Link href="#">Dokumentasjon fra arbeidsgiver</Link>
        </li>
      </ul>

      <div
        style={{
          backgroundColor: 'var(--a-surface-warning-subtle-hover)',
          marginInline: '-1rem',
          paddingInline: '1rem',
          paddingBlock: 'var(--a-spacing-2)',
        }}
      >
        <Label size="small" as="p">
          Dokumentasjon vi mangler
        </Label>
      </div>
      <DocumentationList
        elements={['Dokumentasjon fra arbeidsgiver', 'Bekreftelse på avbrutt studie']}
      />

      <CardDivider />

      <ButtonRow>
        <Button variant="primary">Ettersend dokumentasjon</Button>
        <Button variant="secondary">Se og last ned søknaden</Button>
      </ButtonRow>
    </div>
  );
};
