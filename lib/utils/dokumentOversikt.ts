import { Dokument } from 'lib/types/types';

export const getNumberOfPages = (dokumenter: Dokument[], pageSize: number) => {
  const numberOfPages = Math.ceil(dokumenter.length / pageSize);
  if (numberOfPages === 0) {
    return 1;
  }
  return numberOfPages;
};

export const sortDatoAsc = (dokumenter: Dokument[]) => {
  return [...dokumenter].sort((a, b) => new Date(b.dato).getTime() - new Date(a.dato).getTime());
};

export const sortDatoDesc = (dokumenter: Dokument[]) => {
  return [...dokumenter].sort((a, b) => new Date(a.dato).getTime() - new Date(b.dato).getTime());
};
