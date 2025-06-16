import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
// import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import { CustomI18nValidationPipe } from './shared/pipes/custom-i18n-validation.pipe';
import { ApiConfigService } from './modules/api-config/api-config.service';

async function bootstrap(): Promise<void> {
  console.log(process.cwd() + '/dist/src/shared/entities/*.entity.js');
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new CustomI18nValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.enableShutdownHooks();

  const configService = app.get(ApiConfigService);

  const config = new DocumentBuilder()
    .setTitle('NEST API')
    .setDescription('API documentation by NEST development team')
    .setVersion('1.0')
    .addServer(configService.ownUrl, 'Local server')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.use(cookieParser());
  // app.use(bodyParser.json({ limit: '4gb' }));
  // app.use(bodyParser.urlencoded({ limit: '4gb', extended: true }));

  await app.listen(configService.port, () => {
    console.log(`Server is running on ${configService.port || 8080}`);
  });
}

bootstrap();

//
