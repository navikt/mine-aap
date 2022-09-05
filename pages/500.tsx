import { Heading } from '@navikt/ds-react';
import { Layout } from 'components/Layout/Layout';
import { Section } from 'components/Section/Section';

const Custom500 = () => {
  return (
    <Layout>
      <Section>
        <Heading level="2" size="medium" spacing>
          Det har oppstått en feil.
        </Heading>
      </Section>
    </Layout>
  );
};

export default Custom500;
