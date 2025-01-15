import { getDictionary } from 'app/dev/[lang]/dictionaries';
import styles from './Soknad.module.css';
import { Alert, BodyShort, Heading, Link } from '@navikt/ds-react';
import { DocumentationHeading } from 'components/DocumentationHeading/DocumentationHeading';
import { ButtonRow } from 'components/ButtonRow/ButtonRow';
import { formatDate } from 'lib/utils/date';
import { MineAapEttersendingNy } from 'lib/types/types';
import { DokumentMedTittel } from 'components/Soknad/SoknadMedDatafetching';
import { EttersendelseButton } from 'components/Soknad/EttersendelseButton';

export const Soknad = async ({
  søknad,
  dokumenter,
}: {
  søknad: MineAapEttersendingNy;
  dokumenter: DokumentMedTittel[];
}) => {
  const dict = await getDictionary('nb');
  return (
    <div className={styles.soknad}>
      <Heading level="2" size="medium" style={{ marginBlockEnd: '8px' }}>
        {dict.minSisteSøknad.søknad.heading}
      </Heading>
      <BodyShort size="small" style={{ color: 'var(--a-text-subtle)', marginBlockEnd: '16px' }}>
        {`${dict.minSisteSøknad.mottattDato} ${formatDate(søknad.mottattDato)}`}
      </BodyShort>

      <Alert variant="info">
        Hvis du skal ettersende dokumentasjon til søknaden eller NAV har bedt deg sende dokumentasjon, kan du gjøre det
        her. Har vi ikke bedt om dokumentasjon, trenger du ikke sende oss noe.
      </Alert>

      {dokumenter?.length > 0 && (
        <>
          <DocumentationHeading heading={dict.minSisteSøknad.dokumentasjon.mottatt} />
          <ul>
            {dokumenter.map((dokument) => (
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
        <EttersendelseButton
          innsendingsId={søknad.innsendingsId}
          knappeTekst={dict.minSisteSøknad.søknad.button.text}
        />
      </ButtonRow>
    </div>
  );
};
