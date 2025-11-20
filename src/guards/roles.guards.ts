import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Roles } from 'src/decorators/roles.decorators';
import { PrismaService } from 'src/prisma/prisma.service';
import { StatusText } from 'src/types/response.manager.utils';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly dbService: PrismaService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const roles = this.reflector.get(Roles, context.getHandler());

      if (!roles)
        throw new HttpException(
          `Role permission needed to access this route`,
          HttpStatus.UNAUTHORIZED,
          {
            cause: `token`,
            description: `Role permission needed to access this route`,
          },
        );

      //check if auth header exists
      if (!request.headers.authorization)
        throw new HttpException(
          `Authorization token not found`,
          HttpStatus.UNAUTHORIZED,
          {
            cause: `token`,
            description: `Authorization token not found`,
          },
        );

      //get token from reques, verifiedToken
      const token = request.headers.authorization.split(' ')[1];
      if (!token)
        throw new HttpException(
          `Invalid authorization token`,
          HttpStatus.UNAUTHORIZED,
          {
            cause: `token`,
            description: `Invalid authorization token`,
          },
        );

      //decode token
      const verifiedToken = this.jwtService.verify(token);

      //get user
      const user = await this.dbService.users.findUnique({
        where: {
          id: verifiedToken?.id,
        },
      });

      if (!user)
        throw new HttpException(
          `Failed to verify user or user no longer exist`,
          HttpStatus.UNAUTHORIZED,
          {
            cause: `profile`,
            description: `Failed to verify user or user no longer exist`,
          },
        );

      if (!roles.includes(user.accountType))
        throw new HttpException(
          `User does not have access to this resource`,
          HttpStatus.UNAUTHORIZED,
          {
            cause: `profile`,
            description: `User does not have access to this resource`,
          },
        );

      //attach user to request
      request['user'] = user;

      return true;
    } catch (error) {
      throw new HttpException(
        {
          message: error?.response || 'Unknown error has occured',
          status: StatusText.ERROR,
          code: error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
          data: error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
