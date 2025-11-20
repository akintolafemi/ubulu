import { NestApplicationOptions } from '@nestjs/common';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

const commonTransportOptions = {
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '5m',
  maxFiles: '14d',
};

export const levelFilter = (level: string) =>
  winston.format((info) => {
    return info.level === level ? info : false;
  })();

export const AppOptions: NestApplicationOptions = {
  rawBody: true,
  cors: {
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
  },
  //configure logger with winston
  logger: WinstonModule.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          nestWinstonModuleUtilities.format.nestLike('Ubulu', {
            prettyPrint: true,
          }),
        ),
      }),
      new winston.transports.DailyRotateFile({
        ...commonTransportOptions,
        filename: 'logs/error/%DATE%.log',
        level: 'error',
        format: winston.format.combine(
          levelFilter('error'),
          winston.format.timestamp(),
          winston.format.json(),
        ),
      }),
      new winston.transports.DailyRotateFile({
        ...commonTransportOptions,
        filename: 'logs/info/%DATE%.log',
        level: 'info',
        format: winston.format.combine(
          levelFilter('info'),
          winston.format.timestamp(),
          winston.format.json(),
        ),
      }),
    ],
  }),
};
