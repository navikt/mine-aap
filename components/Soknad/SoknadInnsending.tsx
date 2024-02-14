import * as styles from './Soknad.module.css';
import { Alert, BodyShort, Button, Heading, Link } from '@navikt/ds-react';
import { ButtonRow } from 'components/ButtonRow/ButtonRow';
import { DocumentationHeading } from 'components/DocumentationHeading/DocumentationHeading';
import { Dokument, InnsendingSøknad, MineAapSoknadMedEttersendinger } from 'lib/types/types';
import { formatDate } from 'lib/utils/date';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

interface DokumentMedTittel {
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

  const ettersendteDokumenterMedTittel: DokumentMedTittel[] = useMemo(() => {
    if (dokumenter && dokumenter.length > 0) {
      const dokumenterMedTittel: DokumentMedTittel[] = [];
      const dokumenterFraSoknad = dokumenter.filter((dokument) => dokument.journalpostId === søknad.journalpostId);
      dokumenterFraSoknad.forEach((dokument) => {
        dokumenterMedTittel.push({
          journalpostId: dokument.journalpostId,
          dokumentId: dokument.dokumentId,
          tittel: dokument.tittel,
        });
      });

      ettersendelse?.ettersendinger.forEach((ettersendelse) => {
        const dokument = dokumenter.filter((dokument) => dokument.journalpostId === ettersendelse.journalpostId);

        dokument.forEach((dokument) => {
          dokumenterMedTittel.push({
            journalpostId: dokument.journalpostId,
            dokumentId: dokument.dokumentId,
            tittel: dokument.tittel,
          });
        });
      });

      return dokumenterMedTittel.filter((dokument) => dokument !== undefined) as DokumentMedTittel[]; // filter out undefined
    }
    return [];
  }, [dokumenter, ettersendelse, søknad]);

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

      {ettersendteDokumenterMedTittel?.length > 0 && (
        <>
          <DocumentationHeading heading={formatMessage({ id: 'minSisteSøknad.dokumentasjon.mottatt' })} />
          <ul>
            {ettersendteDokumenterMedTittel.map((dokument) => (
              <li key={dokument.journalpostId}>
                <Link
                  href={`/aap/mine-aap/api/dokument/?journalpostId=${dokument.journalpostId}&dokumentId=${dokument.dokumentId}`}
                  target="_blank"
                  lang="no"
                >
                  {dokument.tittel}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      <ButtonRow>
        <Button variant="primary" onClick={() => router.push(`/${søknad.innsendingsId}/ettersendelse/`)}>
          <FormattedMessage id="minSisteSøknad.søknad.button.text" />
        </Button>
      </ButtonRow>
    </div>
  );
};
