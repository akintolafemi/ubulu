import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { StatusText } from 'src/types/response.manager.utils';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly dbService: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    //check that request is valid
    if (!req.body)
      throw new HttpException(
        {
          message: 'request body not found',
          status: StatusText.BAD_REQUEST,
          code: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );

    const { email, password } = req.body;

    if (!email || !password) {
      throw new HttpException(
        {
          message: 'email or password is invalid',
          status: StatusText.BAD_REQUEST,
          code: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    //get user by username
    const user = await this.dbService.users.findFirst({
      where: {
        deleted: false,
        email,
      },
    });

    //throw error if no matching user is found
    if (!user)
      throw new HttpException(
        {
          message: 'user does not exist',
          status: StatusText.BAD_REQUEST,
          code: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );

    const passwordsMatch = await bcrypt.compare(password, user.password);
    //throw error if passwords do not match
    if (!passwordsMatch)
      throw new HttpException(
        {
          message: `Invalid 'password`,
          status: StatusText.BAD_REQUEST,
          code: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );

    //attach user to request
    req['user'] = user;
    next();
  }
}
