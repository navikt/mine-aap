import { Soknad } from 'components/Soknad/Soknad';
import { hentDokumenter } from 'lib/services/oppslagService';
import { Dokument, MineAapSoknadMedEttersendingNy } from 'lib/types/types';
import { hentAnsvarligMeldekortsystem } from 'lib/services/meldekortBackendService';

export interface DokumentMedTittel {
  journalpostId?: string;
  dokumentId?: string;
  tittel: string;
}

const getDokumenterMedTittel = (dokumenter: Dokument[], søknad: MineAapSoknadMedEttersendingNy) => {
  if (dokumenter && dokumenter.length > 0) {
    const dokumenterMedTittel: DokumentMedTittel[] = [];
    const dokumenterFraSoknad = dokumenter.filter((dokument) => dokument.journalpostId === søknad.journalpostId);
    dokumenterFraSoknad.forEach((dokument) => {
      dokumenterMedTittel.push({
        journalpostId: dokument.journalpostId,
        dokumentId: dokument.dokumentId,
        tittel: dokument.tittel,
      });
    });

    søknad.ettersendinger.forEach((ettersendelse) => {
      const dokument = dokumenter.filter((dokument) => dokument.journalpostId === ettersendelse.journalpostId);

      dokument.forEach((dokument) => {
        dokumenterMedTittel.push({
          journalpostId: dokument.journalpostId,
          dokumentId: dokument.dokumentId,
          tittel: dokument.tittel,
        });
      });
    });

    return dokumenterMedTittel.filter((dokument) => dokument !== undefined) as DokumentMedTittel[]; // filter out undefined
  }
  return [];
};

export const SoknadMedDatafetching = async ({ søknad }: { søknad: MineAapSoknadMedEttersendingNy }) => {
  const dokumenter = await hentDokumenter();
  const ansvarligMeldekortsystem = await hentAnsvarligMeldekortsystem();

  return (
    <Soknad
      søknad={søknad}
      dokumenter={getDokumenterMedTittel(dokumenter, søknad)}
      skalSendeInnKelvinMeldekort={ansvarligMeldekortsystem === 'AAP'}
    />
  );
};
