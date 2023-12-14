import { formatDate, formatFullDate } from 'lib/utils/date';

describe('date', () => {
  describe('formatFullDate', () => {
    test('returnerer tom streng når dato er undefined', () => {
      const resultat = formatFullDate(undefined);
      expect(resultat).toBe('');
    });

    test('returnerer dato på format dd.MM.yyyy HH:mm', () => {
      const resultat = formatFullDate('2023-08-10T12:32');
      expect(resultat).toBe('10.08.2023 12:32');
    });
  });

  describe('formatDate', () => {
    test('returnerer tom streng når dato er undefined', () => {
      const resultat = formatDate(undefined);
      expect(resultat).toBe('');
    });

    test('returnerer format på d. MMMM yyyy', () => {
      const resultat = formatDate('2023-08-10T12:32');
      expect(resultat).toBe('10. august 2023');
    });
  });
});
