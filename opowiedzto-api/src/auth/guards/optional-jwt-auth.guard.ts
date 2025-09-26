import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(OptionalJwtAuthGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const result = await super.canActivate(context);
      return result as boolean;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.debug(`Optional JWT auth failed: ${errorMessage}`);

      return true;
    }
  }

  handleRequest<TUser = User>(err: any, user: any): TUser | undefined {
    if (err || !user || user === false) {
      if (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error';
        this.logger.debug(`JWT validation error: ${errorMessage}`);
      }
      return undefined;
    }

    return user as TUser;
  }
}
