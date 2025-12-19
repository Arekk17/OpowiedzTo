import { ExecutionContext } from '@nestjs/common';
import { OptionalJwtAuthGuard } from './optional-jwt-auth.guard';

describe('OptionalJwtAuthGuard', () => {
  let guard: OptionalJwtAuthGuard;
  let context: ExecutionContext;

  beforeEach(() => {
    guard = new OptionalJwtAuthGuard();
    context = {} as ExecutionContext;
  });

  it('deleguje do AuthGuard przy powodzeniu', async () => {
    const superCanActivate = jest
      .spyOn(Object.getPrototypeOf(guard), 'canActivate')
      .mockResolvedValue(true);

    const result = await guard.canActivate(context);

    expect(superCanActivate).toHaveBeenCalledWith(context);
    expect(result).toBe(true);
  });

  it('zwraca true i loguje przy błędzie autoryzacji', async () => {
    const superCanActivate = jest
      .spyOn(Object.getPrototypeOf(guard), 'canActivate')
      .mockRejectedValue(new Error('invalid token'));
    const loggerSpy = jest.spyOn(guard['logger'], 'debug').mockImplementation();

    const result = await guard.canActivate(context);

    expect(superCanActivate).toHaveBeenCalled();
    expect(loggerSpy).toHaveBeenCalledWith('Optional JWT auth failed: invalid token');
    expect(result).toBe(true);
  });

  it('handleRequest zwraca undefined przy błędzie', () => {
    const loggerSpy = jest.spyOn(guard['logger'], 'debug').mockImplementation();

    const result = guard.handleRequest(new Error('boom'), undefined);

    expect(loggerSpy).toHaveBeenCalledWith('JWT validation error: boom');
    expect(result).toBeUndefined();
  });

  it('handleRequest przekazuje użytkownika', () => {
    const user = { id: 'user-1' };

    expect(guard.handleRequest(undefined, user)).toBe(user);
  });
});



