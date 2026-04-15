import { formatDate, formatFullDate } from 'lib/utils/date';
import { describe, it, expect } from 'vitest';

describe('date', () => {
  describe('formatFullDate', () => {
    it('returnerer tom streng når dato er undefined', () => {
      const resultat = formatFullDate(undefined);
      expect(resultat).toBe('');
    });

    it('returnerer dato på format dd.MM.yyyy HH:mm', () => {
      const resultat = formatFullDate('2023-08-10T12:32');
      expect(resultat).toBe('10.08.2023 12:32');
    });
  });

  describe('formatDate', () => {
    it('returnerer tom streng når dato er undefined', () => {
      const resultat = formatDate(undefined);
      expect(resultat).toBe('');
    });

    it('returnerer format på d. MMMM yyyy', () => {
      const resultat = formatDate('2023-08-10T12:32');
      expect(resultat).toBe('10. august 2023');
    });
  });
});
