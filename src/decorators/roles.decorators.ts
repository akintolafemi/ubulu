import { Reflector } from '@nestjs/core';

export const Roles = Reflector.createDecorator<string[]>();

export const ManageRequestSource = Reflector.createDecorator<{
  requestSource: 'body' | 'param' | 'query';
  key: string;
}>();
