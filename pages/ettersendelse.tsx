import { Heading } from '@navikt/ds-react';
import { FileUpload } from 'components/Inputs/FileUpload';
import PageHeader from 'components/PageHeader';
import { Section } from 'components/Section/Section';
import { beskyttetSide } from 'lib/auth/beskyttetSide';
import { useFeatureToggleIntl } from 'lib/hooks/useFeatureToggleIntl';
import { GetServerSidePropsResult, NextPageContext } from 'next';
import * as styles from 'pages/[uuid]/ettersendelse/Ettersendelse.module.css';

const Ettersendelse = () => {
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
        </Section>

        <FileUpload krav="ANNET" />
      </main>
    </>
  );
};

export const getServerSideProps = beskyttetSide(
  async (ctx: NextPageContext): Promise<GetServerSidePropsResult<{}>> => {
    return {
      props: {},
    };
  }
);

export default Ettersendelse;
