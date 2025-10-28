import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';

/**
 * Bootstrap da aplicação
 *
 * Configura:
 * - Validação global de DTOs
 * - Swagger/OpenAPI
 * - CORS
 * - Prefixo global da API (opcional)
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Pega ConfigService
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: [
      'http://localhost:5173', // Vite dev server
      'http://localhost:5174', // Vite dev server (porta alternativa)
      'http://localhost:3000', // React dev server
      'http://localhost:3001', // Porta alternativa
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

  console.log(`
    🚀 PokéArena API está rodando!

    📍 URL: http://localhost:${port}
    📚 Swagger: http://localhost:${port}/api-docs
    💚 Health: http://localhost:${port}/health

    Ambiente: ${configService.get<string>('nodeEnv')}
  `);
}

bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
  process.exit(1);
});
