import { getNumberOfPages, sortDatoAsc, sortDatoDesc } from '../dokumentOversikt';
import { Dokument } from 'lib/types/types';

const dokumenter: Dokument[] = [
  {
    tittel: 'tittel1',
    type: 'I',
    innsendingsId: 'innsendingsId1',
    dato: '01.01.2020',
  },
  {
    tittel: 'tittel2',
    type: 'I',
    innsendingsId: 'innsendingsId2',
    dato: '02.02.2020',
  },
];

describe('getNumberOfPages', () => {
  const PAGE_SIZE = 5;
  it('should return 1 when there are no documents', () => {
    expect(getNumberOfPages([], PAGE_SIZE)).toBe(1);
  });
  it('should return 1 when there are less documents than the page size', () => {
    expect(getNumberOfPages(dokumenter.slice(0, 1), 2)).toBe(1);
  });
});

describe('sortDatoAsc', () => {
  it('should sort documents by date ascending', () => {
    const sorted = sortDatoAsc(dokumenter);
    expect(sorted[0].dato).toBe('02.02.2020');
    expect(sorted[1].dato).toBe('01.01.2020');
  });
});

describe('sortDatoDesc', () => {
  it('should sort documents by date descending', () => {
    const sorted = sortDatoDesc(dokumenter);
    expect(sorted[0].dato).toBe('01.01.2020');
    expect(sorted[1].dato).toBe('02.02.2020');
  });
});
