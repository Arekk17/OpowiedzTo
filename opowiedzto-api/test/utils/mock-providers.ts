import { JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';

type ConfigStore = Record<string, unknown>;

export type MockConfig = {
  get: jest.Mock<unknown, [string]>;
  getOrThrow: jest.Mock<unknown, [string]>;
  set: jest.Mock<void, [string, unknown]>;
};

export const createMockConfigService = (
  initialValues: ConfigStore = {},
): MockConfig => {
  const store: ConfigStore = { ...initialValues };

  const get = jest.fn((key: string) => store[key]);
  const getOrThrow = jest.fn((key: string) => {
    if (Object.prototype.hasOwnProperty.call(store, key)) {
      return store[key];
    }
    throw new Error(`Missing configuration value for ${key}`);
  });
  const set = jest.fn((key: string, value: unknown) => {
    store[key] = value;
  });

  return { get, getOrThrow, set };
};

export type MockJwtService = {
  signAsync: jest.Mock;
  verifyAsync: jest.Mock;
};

export const createMockJwtService = (token = 'token'): MockJwtService => {
  const signAsync = jest.fn().mockResolvedValue(token);
  const verifyAsync = jest
    .fn()
    .mockImplementation(async (value: string) => ({ value }));
  return { signAsync, verifyAsync };
};
