export type JournalpostProps = {
  journalpostId: string;
  temakode: string;
  temanavn: string;
  tittel: string;
  avsender: string | null;
  mottaker: string | null;
  journalposttype: string;
  opprettet: string;
  dokument: DokumentProps;
  vedlegg: DokumentProps[];
}

export type DokumentProps = {
  dokumentInfoId: string;
  tittel: string;
  filtype: string;
  filstorrelse: number;
  brukerHarTilgang: boolean;
  tilgangssperre: string | null;
}