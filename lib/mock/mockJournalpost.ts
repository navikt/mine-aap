import type { JournalpostProps } from 'components/StatusISak/Dokumentvisning/JournalpostInterfaces';

const mockJournalpost: JournalpostProps = {
  journalpostId: '598134457',
  temakode: 'OMS',
  temanavn: 'Arbeidsavklaringspenger',
  tittel: 'Søknad om å beholde arbeidsavklaringspenger under opphold i innlandet ',
  avsender: 'Navn Navnesen',
  mottaker: null,
  opprettet: '2021-07-10T08:27:01Z',
  journalposttype: 'Inn',
  dokument: {
    dokumentInfoId: '624887896',
    tittel: 'Søknad om å beholde arbeidsavklaringspenger under opphold i innlandet ',
    filtype: 'PDF',
    filstorrelse: 12345678,
    brukerHarTilgang: false,
    tilgangssperre: 'SkannetDokument',
  },
  vedlegg: [
    {
      dokumentInfoId: '624878907',
      tittel: 'Kvitteringsside for dokumentinnsending',
      brukerHarTilgang: false,
      filstorrelse: 12345678,
      filtype: 'PDF',
      tilgangssperre: null,
    },
    {
      dokumentInfoId: '624878937',
      tittel: 'Kvitteringsside for dokumentinnsending',
      brukerHarTilgang: true,
      filstorrelse: 1845678,
      filtype: 'PDF',
      tilgangssperre: null,
    },
    {
      dokumentInfoId: '624879907',
      tittel: 'Kvitteringsside for dokumentinnsending',
      brukerHarTilgang: true,
      filstorrelse: 12345678,
      filtype: 'PDF',
      tilgangssperre: null,
    },
    {
      dokumentInfoId: '644878907',
      tittel: 'Kvitteringsside for dokumentinnsending',
      brukerHarTilgang: true,
      filstorrelse: 12345678,
      filtype: 'PDF',
      tilgangssperre: null,
    },
    {
      dokumentInfoId: '674878907',
      tittel: 'Kvitteringsside for dokumentinnsending',
      brukerHarTilgang: false,
      filstorrelse: 12345678,
      filtype: 'PDF',
      tilgangssperre: null,
    },
  ],
};

export default mockJournalpost;
