import { Alert, BodyShort, Heading, Label, Link, VStack } from '@navikt/ds-react';
import { ButtonRow } from 'components/ButtonRow/ButtonRow';
import { formatDate } from 'lib/utils/date';
import { MineAapEttersendingNy } from 'lib/types/types';
import { DokumentMedTittel } from 'components/Soknad/SoknadMedDatafetching';
import { EttersendelseButton } from 'components/Soknad/EttersendelseButton';
import { getTranslations } from 'next-intl/server';

export const Soknad = async ({
  søknad,
  dokumenter,
}: {
  søknad: MineAapEttersendingNy;
  dokumenter: DokumentMedTittel[];
}) => {
  const t = await getTranslations('minSisteSøknad');
  return (
    <VStack gap="4">
      <Heading level="2" size="medium">
        {t('søknad.heading')}
      </Heading>

      <BodyShort size="small" textColor="subtle">
        {`${t('mottattDato')} ${formatDate(søknad.mottattDato)}`}
      </BodyShort>

      <Alert variant="info">
        Hvis du skal ettersende dokumentasjon til søknaden eller NAV har bedt deg sende dokumentasjon, kan du gjøre det
        her. Har vi ikke bedt om dokumentasjon, trenger du ikke sende oss noe.
      </Alert>

      {dokumenter?.length > 0 && (
        <div>
          <Label>{t('dokumentasjon.mottatt')}</Label>
          <ul>
            {dokumenter.map((dokument) => (
              <li key={dokument.journalpostId}>
                <Link
                  href={`/aap/mine-aap/api/dokument/${dokument.journalpostId}/${dokument.dokumentId}`}
                  target="_blank"
                  lang="no"
                >
                  {dokument.tittel}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ButtonRow>
        <EttersendelseButton innsendingsId={søknad.innsendingsId} />
      </ButtonRow>
    </VStack>
  );
};
