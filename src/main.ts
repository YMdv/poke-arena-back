import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Pega ConfigService
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
      'http://localhost:3001',
      'https://poke-arena-app.onrender.com', // Frontend produção
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Validação global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades não definidas nos DTOs
      forbidNonWhitelisted: true, // Lança erro se propriedades extras forem enviadas
      transform: true, // Transforma payloads em instâncias de DTOs
    }),
  );

  // Prefixo global da API (opcional)
  const apiPrefix = configService.get<string>('apiPrefix');
  if (apiPrefix) {
    app.setGlobalPrefix(apiPrefix);
  }

  // Configuração do Swagger
  setupSwagger(app, configService);

  // Porta da aplicação
  const port = configService.get<number>('port') || 3000;

  await app.listen(port);

  // Detecta ambiente e monta URLs corretas
  const nodeEnv = configService.get<string>('nodeEnv');
  const isProduction = nodeEnv === 'production';
  const baseUrl = isProduction
    ? 'https://poke-arena-back.onrender.com'
    : `http://localhost:${port}`;

  console.log(`
    🚀 PokéArena API está rodando!

    📍 URL: ${baseUrl}
    📚 Swagger: ${baseUrl}/api-docs
    💚 Health: ${baseUrl}/health

    Ambiente: ${nodeEnv}
    Porta: ${port}
  `);
}

bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
  process.exit(1);
});
