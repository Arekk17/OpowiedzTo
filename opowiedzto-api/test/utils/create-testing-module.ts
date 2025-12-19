import { ModuleMetadata } from '@nestjs/common';
import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { createMockConfigService, createMockJwtService } from './mock-providers';

type TestingOverrides = {
  configValues?: Record<string, unknown>;
  jwtToken?: string;
};

export const buildTestingModule = (
  metadata: ModuleMetadata,
  overrides: TestingOverrides = {},
): TestingModuleBuilder => {
  const providers = [
    { provide: ConfigService, useValue: createMockConfigService(overrides.configValues) },
    { provide: JwtService, useValue: createMockJwtService(overrides.jwtToken) },
    ...(metadata.providers ?? []),
  ];

  return Test.createTestingModule({
    ...metadata,
    providers,
  });
};

