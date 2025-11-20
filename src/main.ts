import {
  BadRequestException,
  HttpStatus,
  Logger,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppOptions } from '@utils/app.options.utils';
import { StatusText } from './types/response.manager.utils';

async function bootstrap() {
  //Initiate nest application
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    AppOptions,
  );

  app.use(helmet()); //use helmet for security

  app.setGlobalPrefix('/api/v1'); //set versioning

  //configure default validation pipe to retrive error messages from class validator and return the first error to client
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //remove unexpected fields from request
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        return new BadRequestException({
          status: StatusText.BAD_REQUEST,
          code: HttpStatus.BAD_REQUEST,
          message:
            errors[0]?.children[0]?.children[0]?.constraints[
              Object?.keys(errors[0]?.children[0]?.children[0]?.constraints)[0]
            ] ||
            errors[0]?.children[0]?.constraints[
              Object?.keys(errors[0]?.children[0]?.constraints)[0]
            ] ||
            errors[0]?.constraints[Object?.keys(errors[0]?.constraints)[0]] ||
            'Unable to validate request',
        });
      },
    }),
  );

  const logger = new Logger(NestApplication.name);

  //configure swagger documenation at route /documentation
  const config = new DocumentBuilder()
    .setTitle('Ubulu API')
    .setDescription('API for Ubulu')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      bearerFormat: 'JWT',
      name: 'authorization',
      scheme: 'bearer',
    })
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, documentFactory);

  const port = process.env.PORT;
  await app.listen(port, () => {
    logger.log(`Server is now listening on port ${port}`);
  });
}
bootstrap();
