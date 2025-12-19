import 'reflect-metadata';

jest.mock('bcryptjs', () => {
  return {
    hash: jest.fn((value: string) => Promise.resolve(`hashed-${value}`)),
    compare: jest.fn((value: string, hashed: string) =>
      Promise.resolve(hashed === `hashed-${value}`),
    ),
    genSalt: jest.fn(() => Promise.resolve('salt')),
  };
});

jest.mock('uuid', () => {
  return {
    v4: jest.fn(() => '00000000-0000-0000-0000-000000000000'),
  };
});

export {}; // zapewnia, że plik jest traktowany jako moduł
