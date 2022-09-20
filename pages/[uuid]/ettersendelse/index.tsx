import { Alert, BodyShort, Button, Heading, Label, Link } from '@navikt/ds-react';
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
import { useEffect, useState } from 'react';
import { FieldErrors } from 'react-hook-form';
import { FormErrorSummary } from 'components/FormErrorSummary/FormErrorSummary';
import { setFocus } from 'lib/utils/dom';
import NextLink from 'next/link';
import { Left } from '@navikt/ds-icons';
import { useRouter } from 'next/router';

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

  const [errors, setErrors] = useState<FieldErrors>({});

  const router = useRouter();

  const errorSummaryId = `form-error-summary-${søknad?.søknadId ?? 'generic'}`;

  const updateErrorSummary = (errorsFromKrav: FieldErrors, krav: string) => {
    const updatedErrors = { ...errors, [krav]: errorsFromKrav[krav] };
    const filteredErrors = Object.keys(updatedErrors).reduce((object, key) => {
      if (updatedErrors[key]) {
        // @ts-ignore
        object[key] = updatedErrors[key];
      }
      return object;
    }, {});

    setErrors(filteredErrors);
  };

  return (
    <>
      <PageHeader align="center" variant="guide">
        {formatMessage('ettersendelse.appTittel')}
      </PageHeader>
      <main className={styles.main}>
        <Section>
          <NextLink href="/" passHref>
            <Link>
              <Left />
              Tilbake til Mine Arbeidsavklaringspenger
            </Link>
          </NextLink>
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

        <FormErrorSummary id={errorSummaryId} errors={errors} />

        {søknad.manglendeVedlegg?.map((krav) => (
          <FileUpload
            søknadId={søknad.søknadId}
            krav={krav}
            updateErrorSummary={updateErrorSummary}
            setErrorSummaryFocus={() => setFocus(errorSummaryId)}
            key={krav}
          />
        ))}

        <FileUpload
          søknadId={søknad.søknadId}
          krav="ANNET"
          updateErrorSummary={updateErrorSummary}
          setErrorSummaryFocus={() => setFocus(errorSummaryId)}
        />

        <Section>
          <div>
            <Button icon={<Left />} variant="tertiary" onClick={() => router.push('/')}>
              Tilbake til Mine Arbeidsavklaringspenger
            </Button>
          </div>
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
