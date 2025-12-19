import { ExecutionContext } from '@nestjs/common';

import { RefreshTokenAuthGuard } from './refresh-token-auth.guard';

describe('RefreshTokenAuthGuard', () => {
  it('deleguje do bazowego AuthGuard', async () => {
    const guard = new RefreshTokenAuthGuard();
    const context = {} as ExecutionContext;
    const superCanActivate = jest
      .spyOn(Object.getPrototypeOf(guard), 'canActivate')
      .mockResolvedValue(true);

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(superCanActivate).toHaveBeenCalledWith(context);
  });
});



