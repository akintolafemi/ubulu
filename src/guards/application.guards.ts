import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ManageRequestSource } from 'src/decorators/roles.decorators';
import { PrismaService } from 'src/prisma/prisma.service';
import { StatusText } from 'src/types/response.manager.utils';

@Injectable()
export class ManageApplicationGuard implements CanActivate {
  constructor(
    private readonly dbService: PrismaService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const manageRequest = this.reflector.get(
      ManageRequestSource,
      context.getHandler(),
    );
    let applicationId = '';

    //retrieve applicationId from one of request body, query, param
    switch (manageRequest.requestSource) {
      case 'body':
        applicationId = request.body[`${manageRequest.key}`];
        break;
      case 'param':
        applicationId = request.params[`${manageRequest.key}`];
        break;
      case 'query':
        applicationId = request.query[`${manageRequest.key}`];
      default:
        break;
    }
    //find application, also ensuring it's not yet deleted
    const application = await this.dbService.applications.findFirst({
      where: {
        id: applicationId,
        deleted: false,
      },
    });

    //return message back to user
    if (!application)
      throw new HttpException(
        {
          message: 'Application not found',
          status: StatusText.NOT_FOUND,
          code: HttpStatus.NOT_FOUND,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    request['application'] = application;
    return true;
  }
}
