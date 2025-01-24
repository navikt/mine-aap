import { Heading } from '@navikt/ds-react';
import { Layout } from 'components/Layout/Layout';
import { Section } from 'components/Section/Section';

const Custom404 = () => {
  return (
    <Layout>
      <Section>
        <Heading level="2" size="medium" spacing>
          Denne siden finnes ikke.
        </Heading>
      </Section>
    </Layout>
  );
};

export default Custom404;
