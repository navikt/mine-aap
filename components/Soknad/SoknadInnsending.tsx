import * as styles from './Soknad.module.css';
import { Alert, BodyShort, Button, Heading } from '@navikt/ds-react';
import { ButtonRow } from 'components/ButtonRow/ButtonRow';
import { DocumentationHeading } from 'components/DocumentationHeading/DocumentationHeading';
import { Dokument, InnsendingSøknad, MineAapSoknadMedEttersendinger } from 'lib/types/types';
import { formatDate } from 'lib/utils/date';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

interface DokuementMedTittel {
  journalpostId?: string;
  dokumentId?: string;
  tittel: string;
}

export const SoknadInnsending = ({
  søknad,
  ettersendelse,
}: {
  søknad: InnsendingSøknad;
  ettersendelse?: MineAapSoknadMedEttersendinger;
}) => {
  const [dokumenter, setDokumenter] = useState<Dokument[] | undefined>(undefined);

  const router = useRouter();
  const { formatMessage } = useIntl();

  useEffect(() => {
    const getDokumenter = async () => {
      const result = await fetch('/aap/mine-aap/api/dokumenter/');
      if (!result.ok) {
        setDokumenter([]);
      }
      const json = await result.json();
      setDokumenter(json);
    };
    getDokumenter();
  }, []);

  const ettersendteDokumenterMedTittel: DokuementMedTittel[] = useMemo(() => {
    if (dokumenter && dokumenter.length > 0) {
      const dokumenter: DokuementMedTittel[] = ettersendelse?.ettersendinger
        .map((ettersendelse) => {
          const dokument = dokumenter.find((dokument) => dokument.journalpostId === ettersendelse.journalpostId);

          if (dokument) {
            return {
              journalpostId: dokument.journalpostId,
              dokumentId: dokument.dokumentId,
              tittel: dokument.tittel,
            };
          }
          return;
        })
        .filter((dokument) => dokument !== undefined) as DokuementMedTittel[]; // filter out undefined
    }
    return [];
  }, [dokumenter, ettersendelse]);

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

      {ettersendteDokumenterMedTittel.length > 0 && (
        <DocumentationHeading heading={formatMessage({ id: 'minSisteSøknad.dokumentasjon.mottatt' })} />
      )}
      {ettersendteDokumenterMedTittel.map((dokument) => (
        <div key={dokument.journalpostId}>{dokument.tittel}</div>
      ))}

      <ButtonRow>
        <Button variant="primary" onClick={() => router.push(`/${søknad.innsendingsId}/ettersendelse/`)}>
          <FormattedMessage id="minSisteSøknad.søknad.button.text" />
        </Button>
      </ButtonRow>
    </div>
  );
};
