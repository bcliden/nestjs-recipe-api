import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (request) {
      // if HTTP
      if (!request.headers.authorization) {
        return false;
      }

      request.user = await this.validateToken(request.headers.authorization);

      return true;
    } else {
      // else GraphQL
      const ctx: any = GqlExecutionContext.create(context).getContext();
      // const info = ctx.getInfo();
      // const args = ctx.getArgs();
      if (!ctx.headers.authorization) {
        return false;
      }
      ctx.user = await this.validateToken(ctx.headers.authorization);
      return true;
    }
  }

  async validateToken(auth: string) {
    if (auth.split(' ')[0] !== 'Bearer') {
      throw new ForbiddenException('Invalid Token');
    }

    const token = auth.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch (err) {
      throw new ForbiddenException(`Token error: ${err.message || err.name}`);
    }
  }
}
