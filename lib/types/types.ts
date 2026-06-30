import type { components as innsendingComponents, paths as innsendingPaths } from './innsendingschema';
import type { components as oppslagComponents, paths as oppslagPaths } from './oppslagschema';

export type HentDokumenterResponse =
  oppslagPaths['/dokumenter']['get']['responses']['200']['content']['application/json'];
export type Dokument = oppslagComponents['schemas']['Dokument'];

export type VedleggType = 'ARBEIDSGIVER' | 'STUDIER' | 'ANDREBARN' | 'OMSORG' | 'UTLAND' | 'ANNET';

export interface Ettersendelse {
  søknadId?: string;
  totalFileSize: number;
  ettersendteVedlegg: Array<EttersendteVedlegg>;
}

export interface EttersendteVedlegg {
  ettersending: Array<string>;
  vedleggType: VedleggType;
}

// TODO: burde vært export type InnsendingRequest = innsendingPaths['/innsending']['post']['requestBody']['content'];
export type InnsendingRequest = innsendingComponents['schemas']['innsending.dto.Innsending'];

export type InnsendingResponse =
  innsendingPaths['/innsending']['post']['responses']['200']['content']['application/json'];

export type LagreVedleggResponse =
  innsendingPaths['/mellomlagring/fil']['post']['responses']['200']['content']['application/json'];

export type SoknadMedEttersendingerResponse =
  innsendingPaths['/innsending/søknadmedettersendinger']['get']['responses']['200']['content']['application/json'];

export type SoknadMedEttersendinger = innsendingComponents['schemas']['innsending.dto.MineAapSoknadMedEttersendingNy'];
export type Ettersending = innsendingComponents['schemas']['innsending.dto.MineAapEttersendingNy'];
