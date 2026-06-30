import { Soknad } from 'components/Soknad/Soknad';
import { hentDokumenter } from 'lib/services/oppslagService';
import type { Dokument, SoknadMedEttersendinger } from 'lib/types/types';
import { isSuccess } from 'lib/utils/api-fetch';
import { dokumentTittel } from 'lib/utils/dokumentOversikt';

export interface DokumentMedTittel {
  journalpostId?: string;
  dokumentId?: string;
  tittel: string;
}

const getDokumenterMedTittel = (dokumenter: Dokument[], søknad: SoknadMedEttersendinger) => {
  if (dokumenter && dokumenter.length > 0) {
    const dokumenterMedTittel: DokumentMedTittel[] = [];
    const dokumenterFraSoknad = dokumenter.filter((dokument) => dokument.journalpostId === søknad.journalpostId);
    dokumenterFraSoknad.forEach((dokument) => {
      dokumenterMedTittel.push({
        journalpostId: dokument.journalpostId,
        dokumentId: dokument.dokumentId,
        tittel: dokumentTittel(dokument),
      });
    });

    søknad.ettersendinger.forEach((ettersendelse) => {
      const dokument = dokumenter.filter((dokument) => dokument.journalpostId === ettersendelse.journalpostId);

      dokument.forEach((dokument) => {
        dokumenterMedTittel.push({
          journalpostId: dokument.journalpostId,
          dokumentId: dokument.dokumentId,
          tittel: dokumentTittel(dokument),
        });
      });
    });

    return dokumenterMedTittel.filter((dokument) => dokument !== undefined) as DokumentMedTittel[]; // filter out undefined
  }
  return [];
};

export const SoknadMedDatafetching = async ({ søknad }: { søknad: SoknadMedEttersendinger }) => {
  const dokumenter = await hentDokumenter();
  const dokumenterMedTittel = isSuccess(dokumenter) ? getDokumenterMedTittel(dokumenter.data, søknad) : [];

  return <Soknad søknad={søknad} dokumenter={dokumenterMedTittel} />;
};
