import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Walidacja danych wejściowych
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Konfiguracja CORS
  app.enableCors();

  // Konfiguracja Swagger
  const config = new DocumentBuilder()
    .setTitle('OpowiedzTo API')
    .setDescription('API do zarządzania postami użytkowników')
    .setVersion('1.0')
    .addTag('posts')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Aplikacja działa na porcie ${process.env.PORT ?? 3000}`);
}
bootstrap();
