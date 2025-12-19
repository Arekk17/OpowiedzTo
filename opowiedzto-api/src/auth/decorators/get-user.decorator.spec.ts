import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { ExecutionContext } from '@nestjs/common';

import { GetUser } from './get-user.decorator';
import { GetOptionalUser } from './get-optional-user.decorator';

// Helper do pobierania factory z param decoratora
function getParamDecoratorFactory(decorator: Function) {
  class Test {
    public test(@decorator() _value: unknown) {}
  }
  const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, Test, 'test');
  return Object.values(args)[0] as { factory: Function };
}

describe('Auth decorators', () => {
  it('GetUser zwraca użytkownika z requestu', () => {
    const user = { id: 'user-1' };
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    } as unknown as ExecutionContext;

    const factory = getParamDecoratorFactory(GetUser);
    expect(factory.factory(null, context)).toBe(user);
  });

  it('GetOptionalUser dopuszcza brak użytkownika', () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({}),
      }),
    } as unknown as ExecutionContext;

    const factory = getParamDecoratorFactory(GetOptionalUser);
    expect(factory.factory(null, context)).toBeUndefined();
  });
});
