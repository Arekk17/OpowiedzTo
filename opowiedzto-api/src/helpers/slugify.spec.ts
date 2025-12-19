import { slugify } from './slugify';

describe('slugify', () => {
  it('zwraca przyciętą nazwę i slug bez znaków specjalnych', () => {
    const result = slugify(' React & JavaScript 101 ');

    expect(result).toEqual({
      name: 'React & JavaScript 101',
      slug: 'react-javascript-101',
    });
  });

  it('ogranicza slug do 64 znaków', () => {
    const input = 'a'.repeat(100);
    const result = slugify(input);

    expect(result.slug.length).toBeLessThanOrEqual(64);
  });

  it('zwraca puste wartości dla braku wejścia', () => {
    expect(slugify('')).toEqual({ name: '', slug: '' });
  });
});
