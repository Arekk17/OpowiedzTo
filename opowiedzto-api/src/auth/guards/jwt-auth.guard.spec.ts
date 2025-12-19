import { ExecutionContext } from '@nestjs/common';

import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  it('deleguje do bazowego AuthGuard', async () => {
    const guard = new JwtAuthGuard();
    const context = {} as ExecutionContext;
    const superCanActivate = jest
      .spyOn(Object.getPrototypeOf(guard), 'canActivate')
      .mockResolvedValue(true);

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(superCanActivate).toHaveBeenCalledWith(context);
  });
});



