import type { RequestBody, ResponseBody } from 'lib/types/openapi';
import type { components, paths } from './apiinternschema';

type ResponseOfGet<Url extends keyof paths> = ResponseBody<paths[Url]['get']>;
// biome-ignore lint/correctness/noUnusedVariables: <not in use yet>
type RequestOfPost<Url extends keyof paths> = RequestBody<paths[Url]['post']>;
// biome-ignore lint/correctness/noUnusedVariables: <not in use yet>
type RequestOfPut<Url extends keyof paths> = RequestBody<paths[Url]['put']>;
// biome-ignore lint/correctness/noUnusedVariables: <not in use yet>
type ResponseOfPost<Url extends keyof paths> = ResponseBody<paths[Url]['post']>;

export type SakerMedBehandlingerResponse = ResponseOfGet<'/mine-aap/saker-med-behandlinger'>;
export type SakMedBehandlinger = components['schemas']['no.nav.aap.api.mineaap.SakMedBehandlingerVisning'];
export type Behandling = components['schemas']['no.nav.aap.api.mineaap.BehandlingVisningResponse'];
export type BehandlingHendelseNavn = components['schemas']['no.nav.aap.api.mineaap.BehandlingHendelseResponse']['navn'];
export type BehandlingHendelseProgresjon =
  components['schemas']['no.nav.aap.api.mineaap.BehandlingHendelseResponse']['progresjon'];

export type BehandlingHendelse = components['schemas']['no.nav.aap.api.mineaap.BehandlingHendelseResponse'];
export type BehandlingHendelseAlderLovvalg =
  components['schemas']['no.nav.aap.api.mineaap.BehandlingHendelseResponse.AlderLovvalgMedlemskap'];
export type BehandlingHendelseFerdigBehandlet =
  components['schemas']['no.nav.aap.api.mineaap.BehandlingHendelseResponse.FerdigBehandlet'];
export type BehandlingHendelseNavKontor =
  components['schemas']['no.nav.aap.api.mineaap.BehandlingHendelseResponse.NavKontor'];
export type BehandlingHendelseNay = components['schemas']['no.nav.aap.api.mineaap.BehandlingHendelseResponse.Nay'];
export type BehandlingHendelseSoknadMottatt =
  components['schemas']['no.nav.aap.api.mineaap.BehandlingHendelseResponse.S\u00F8knadMottatt'];
