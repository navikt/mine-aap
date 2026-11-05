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
export type Behandling = components['schemas']['no.nav.aap.api.mineaap.BehandlingVisningResponse'];
