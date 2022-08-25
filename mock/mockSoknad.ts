import { randomUUID } from 'crypto';
import { Søknad } from '../types/types';

export const mockSøknader: Søknad[] = [
  {
    fnr: '11223312345',
    opprettet: new Date().toISOString(),
    søknadId: randomUUID(),
    mangler: ['ARBEIDSGIVER'],
  },
];
