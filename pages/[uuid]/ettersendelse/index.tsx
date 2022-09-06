import { Alert, BodyShort, Heading, Label } from '@navikt/ds-react';
import { GetServerSidePropsResult, NextPageContext } from 'next';
import { getAccessToken } from 'lib/auth/accessToken';
import { beskyttetSide } from 'lib/auth/beskyttetSide';
import { FileUpload } from 'components/Inputs/FileUpload';
import PageHeader from 'components/PageHeader';
import { Section } from 'components/Section/Section';
import { useFeatureToggleIntl } from 'lib/hooks/useFeatureToggleIntl';
import { OpplastetVedlegg, Søknad } from 'lib/types/types';
import * as styles from 'pages/[uuid]/ettersendelse/Ettersendelse.module.css';
import { getSøknad } from 'pages/api/soknader/[uuid]';
import { getStringFromPossiblyArrayQuery } from 'lib/utils/string';
import logger from 'lib/utils/logger';

export const setErrorSummaryFocus = () => {
  const errorSummaryElement = document && document.getElementById('skjema-feil-liste');
  if (errorSummaryElement) errorSummaryElement.focus();
};
interface PageProps {
  søknad: Søknad;
}

export interface FormValues {
  FORELDER: OpplastetVedlegg[];
  FOSTERFORELDER: OpplastetVedlegg[];
  STUDIESTED: OpplastetVedlegg[];
  ANNET: OpplastetVedlegg[];
}

const Index = ({ søknad }: PageProps) => {
  const { formatMessage } = useFeatureToggleIntl();

  return (
    <>
      <PageHeader align="center" variant="guide">
        {formatMessage('ettersendelse.appTittel')}
      </PageHeader>
      <main className={styles.main}>
        <Section>
          <Heading level="2" size="medium" spacing>
            {formatMessage('ettersendelse.heading')}
          </Heading>
          <div>
            <Label spacing>{formatMessage('ettersendelse.manglerDokumentasjon')}</Label>
            {(søknad.manglendeVedlegg?.length ?? 0) > 0 && (
              <ul>
                {søknad.manglendeVedlegg?.map((krav) => (
                  <li key={krav}>{formatMessage(`ettersendelse.vedleggstyper.${krav}.heading`)}</li>
                ))}
              </ul>
            )}
          </div>
        </Section>

        {søknad.manglendeVedlegg?.map((krav) => (
          <FileUpload søknadId={søknad.søknadId} krav={krav} key={krav} />
        ))}

        <FileUpload søknadId={søknad.søknadId} krav="ANNET" />

        <Section>
          <Alert variant="warning">
            <Label spacing>{formatMessage('ettersendelse.warning.heading')}</Label>
            <BodyShort spacing>{formatMessage('ettersendelse.warning.description')}</BodyShort>
          </Alert>
        </Section>
      </main>
    </>
  );
};

export const getServerSideProps = beskyttetSide(
  async (ctx: NextPageContext): Promise<GetServerSidePropsResult<{}>> => {
    const bearerToken = getAccessToken(ctx);
    const uuid = getStringFromPossiblyArrayQuery(ctx.query.uuid);
    const søknad = await getSøknad(uuid as string, bearerToken);

    logger.info(`Søknad ${JSON.stringify(søknad)}`);
    if (!søknad) {
      return {
        notFound: true,
      };
    }

    return {
      props: { søknad },
    };
  }
);

export default Index;
