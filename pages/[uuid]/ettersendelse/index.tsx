import { Alert, BodyShort, Button, Heading, Label } from '@navikt/ds-react';
import { GetServerSidePropsResult, NextPageContext } from 'next';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import { getAccessToken } from '../../../auth/accessToken';
import { beskyttetSide } from '../../../auth/beskyttetSide';
import { FormErrorSummary } from '../../../components/FormErrorSummary/FormErrorSummary';
import { FileInput } from '../../../components/Inputs/FileInput';
import { FileUpload } from '../../../components/Inputs/FileUpload';
import PageHeader from '../../../components/PageHeader';
import { Section } from '../../../components/Section/Section';
import { useFeatureToggleIntl } from '../../../hooks/useFeatureToggleIntl';
import { OpplastetVedlegg, Søknad, Vedleggskrav } from '../../../types/types';
import { getVedleggskrav } from '../../api/ettersendelse/vedleggskrav';
import { getSøknader } from '../../api/soknader';
import * as styles from './Ettersendelse.module.css';

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

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormValues>();

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
                  <li key={krav}>{krav}</li>
                ))}
              </ul>
            )}
          </div>
        </Section>

        <FormErrorSummary
          id="skjema-feil-liste"
          errors={errors as FieldErrors}
          data-testid={'error-summary'}
        />
        {søknad.manglendeVedlegg?.map((krav) => (
          <FileUpload krav={krav} key={krav} />
        ))}

        <Section>
          <FileUpload krav="ANNET" />
        </Section>

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
    const søknader = await getSøknader(bearerToken);

    const uuid = ctx.query.uuid;
    const søknad = søknader.find((søknad: Søknad) => søknad.søknadId === uuid);

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
