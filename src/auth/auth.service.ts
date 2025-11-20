import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import RequestWithUser from 'src/types/request.with.user.type';
import { ResponseManager, StatusText } from 'src/types/response.manager.utils';

@Injectable()
export class AuthService {
  constructor(
    @Inject(REQUEST) private request: RequestWithUser,
    private readonly jwtService: JwtService,
  ) {}

  async signJWT() {
    const payload = {
      email: this.request.user.email,
      id: this.request.user.id,
    };
    const options: JwtSignOptions = {};
    const token = this.jwtService.sign(payload, options);

    const user = this.request.user;
    delete user.password;

    return ResponseManager.standardResponse({
      code: HttpStatus.OK,
      message: 'Authentication successful',
      status: StatusText.OK,
      data: {
        token,
        user,
      },
    });
  }
}
