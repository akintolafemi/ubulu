import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthDto } from '@dtos/auth.dtos';

@ApiBearerAuth()
@ApiBadRequestResponse({
  description: 'Incorrect request body',
})
@ApiUnauthorizedResponse({
  description: 'Invalid authorization token',
})
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @ApiBody({
    description: 'Request body',
    type: AuthDto,
  })
  @Post(`/signin`)
  public async SignIn() {
    return this.service.signJWT();
  }
}
