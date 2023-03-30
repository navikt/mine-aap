import { validFileTypes, validateFile } from '../FileInput';

describe('FileInput validation', () => {
  it('should return 415 for wrong file type', () => {
    const file = new File([], 'test.txt', { type: 'text/plain' });
    expect(validateFile(file)).toBe('filtype');
  });

  it('should return undefined for valid file', () => {
    validFileTypes.forEach((type) => {
      const file = new File([], 'test.png', { type: type });
      expect(validateFile(file)).toBeUndefined();
    });
  });
});
