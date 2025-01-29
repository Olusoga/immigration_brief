import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filter/all-exception-filter';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) =>
        new BadRequestException(
          errors.map((error) => ({
            field: error.property,
            errors: Object.values(error.constraints as any),
          })),
        ),
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(helmet());
  app.enableCors({
    origin: true,
    allowedHeaders: [
      'X-Requested-With',
      'X-HTTP-Method-Override',
      'Content-Type',
      'Accept',
      'Observe',
      'Authorization',
      'Origin',
    ],
    methods: 'GET,PUT,POST,PATCH,DELETE,UPDATE,OPTIONS',
    credentials: true,
  });
  const options = new DocumentBuilder()
    .setTitle('Immigration-Brief APIS')
    .setDescription(
      'Immigration-Brief Endpoints',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'jwt',
    )
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, options);

  app.use('/immigration-brief', (req, res) => {
    res.json(swaggerDocument);
  });

  SwaggerModule.setup('/immigration', app, swaggerDocument, {
    customCss:
      '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }',
    customCssUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js',
    ],
  });
  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
