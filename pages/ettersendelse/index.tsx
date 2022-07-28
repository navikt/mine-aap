import { Alert, BodyShort, Heading, Label, PageHeader } from '@navikt/ds-react';
import { GetServerSidePropsResult, NextPageContext } from 'next';
import { getAccessToken } from '../../auth/accessToken';
import { beskyttetSide } from '../../auth/beskyttetSide';
import { FileInput } from '../../components/Inputs/FileInput';
import { Section } from '../../components/Section/Section';
import { Vedleggskrav } from '../../types/types';
import { getVedleggskrav } from '../api/ettersendelse/vedleggskrav';
import * as styles from './Ettersendelse.module.css';

interface PageProps {
  vedleggskrav: Vedleggskrav[];
}

const Index = ({ vedleggskrav }: PageProps) => {
  return (
    <>
      <PageHeader align="center" variant="guide">
        Ettersending til arbeidsavklaringspenger (AAP)
      </PageHeader>
      <main className={styles.main}>
        <Section>
          <Heading level="2" size="medium" spacing>
            Ettersend dokumentasjon
          </Heading>
          <div>
            <Label spacing>
              Ut fra det du har svart i søknaden, mangler du følgende dokumentasjon for at vi kan
              ferdigbehandle søknaden din
            </Label>
            {vedleggskrav.length > 0 && (
              <ul>
                {vedleggskrav.map((krav) => (
                  <li key={krav.dokumentasjonstype}>{krav.dokumentasjonstype}</li>
                ))}
              </ul>
            )}
          </div>
        </Section>

        {vedleggskrav.map((krav) => (
          <Section key={krav.dokumentasjonstype}>
            <FileInput heading={krav.dokumentasjonstype} description={krav.beskrivelse} />
          </Section>
        ))}

        <Section>
          <Alert variant="warning">
            <Label spacing>Har du ikke alle dokumentene tilgjengelig nå?</Label>
            <BodyShort spacing>
              Du kan gå videre uten å laste opp alle dokumenetene. Hvis du skal ettersende vedlegg,
              må du sende disse innen 14 dager etter at søknaden er sendt inn. Trenger du mer tid,
              kan du be om lenger frist. Dette kan du gjøre via nav.no eller ringe oss etter at
              søknaden er sendt inn.
            </BodyShort>
          </Alert>
        </Section>
      </main>
    </>
  );
};

export const getServerSideProps = beskyttetSide(
  async (ctx: NextPageContext): Promise<GetServerSidePropsResult<{}>> => {
    const bearerToken = getAccessToken(ctx);
    const vedleggskrav = await getVedleggskrav(bearerToken);
    return {
      props: { vedleggskrav },
    };
  }
);

export default Index;
