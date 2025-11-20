import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({
    type: 'string',
    example: 'gracepen@ubulu.africa',
  })
  email: string;

  @ApiProperty({
    type: 'string',
    example: 'password',
  })
  password: string;
}
