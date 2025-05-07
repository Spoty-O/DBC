import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import checkEnv from './env';
import * as bodyParser from 'body-parser';

import { CustomI18nValidationPipe } from './shared/pipes/custom-i18n-validation.pipe';

async function bootstrap(): Promise<void> {
  checkEnv();

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new CustomI18nValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.enableShutdownHooks();

  const config = new DocumentBuilder()
    .setTitle('NEST API')
    .setDescription('API documentation by NEST development team')
    .setVersion('1.0')
    .addServer(process.env.OWN_URL, 'Local server')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.use(bodyParser.json({ limit: '4gb' }));
  app.use(bodyParser.urlencoded({ limit: '4gb', extended: true }));

  await app.listen(process.env.PORT || 8080, () => {
    console.log(`Server is running on ${process.env.PORT || 8080}`);
  });
}

bootstrap();

//
