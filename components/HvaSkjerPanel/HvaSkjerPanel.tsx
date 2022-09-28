import { Panel, Heading, Label, BodyLong, BodyShort } from '@navikt/ds-react';
import Link from 'next/link';
import styles from './HvaSkjerPanel.module.css';

export const HvaSkjerPanel = () => {
  return (
    <Panel className={styles.panel}>
      <Heading level="2" size="medium" spacing>
        Vi har mottatt søknaden din, hva skjer nå?
      </Heading>
      <ul>
        <li>
          <Label as={'p'}>Vi sjekker om vi har nok helseopplysninger</Label>
          <BodyLong spacing>
            Hvis vi har behov for flere helseopplysninger, vil vi bruke informasjonen du ga oss i
            søknaden til å bestille legeerklæring fra lege eller annen behandler.
          </BodyLong>
        </li>
        <li>
          <Label as={'p'}>
            Vi vurderer mulighetene og begrensningene dine i møte med arbeidslivet
          </Label>
          <BodyLong spacing>
            Du har krav på en vurdering av hvilken oppfølging du trenger fra NAV for å komme i eller
            beholde arbeid (folketrygdloven §14a). Vi bruker helseopplysninger og opplysningene du
            har gitt oss til å se på mulighetene dine. Hvis vi trenger det, tar vi kontakt med deg.
            Du får et brev med vurderingen vår. Hvis du har spørsmål kan du ta kontakt med oss. Hvis
            du ikke er enig i vurderingen,{' '}
            <Link href="https://www.nav.no/soknader/nb/person/arbeid/arbeidsavklaringspenger/NAV%2011-13.05/klage-eller-anke/brev">
              kan du klage på oppfølgingsvedtaket
            </Link>
            .
          </BodyLong>
        </li>
        <li>
          <Label as={'p'}>Hva kan du gjøre?</Label>
          <BodyShort spacing>Det er til hjelp for oss om du:</BodyShort>
          <ul>
            <li>
              Registrerer{' '}
              <Link href="https://arbeidsplassen.nav.no/">CV-en din på arbeidsplassen.no</Link>
            </li>
            <li>Husker å ettersende dokumenter som mangler</li>
            <li>Gir beskjed hvis situasjoen din endrer seg</li>
          </ul>
        </li>
        <li>
          <Label as={'p'}>Vi sjekker om du har rett på AAP</Label>
          <BodyLong spacing>
            Til sist sjekker vi om du har rett på AAP etter folketrygdloven kapittel 11. Vi bruker
            her opplysningene vi har fått i forbindelse med søknaden.
          </BodyLong>
        </li>
        <li>
          <Label as={'p'}>Svar på AAP-søknaden</Label>
          <BodyLong spacing>
            Du får et vedtak med vurderingen vår av om du har rett på AAP eller ikke, og hvor mye du
            vil få utbetalt. Hvis du har spørsmål til vurderingen, kan du ta kontakt med oss. Hvis
            du ikke er enig,{' '}
            <Link href="https://www.nav.no/soknader/nb/person/arbeid/arbeidsavklaringspenger/NAV%2011-13.05/klage-eller-anke/brev">
              kan du klage på AAP-vedtaket
            </Link>
            .
          </BodyLong>
          <BodyLong spacing>
            Du har rett til oppfølgning fra NAV uansett om du får innvilget AAP eller ikke.
          </BodyLong>
        </li>
      </ul>
    </Panel>
  );
};
