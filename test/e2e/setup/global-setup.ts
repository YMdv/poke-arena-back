/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../../src/app.module';

export default async function globalSetup() {
  console.log('\n🚀 Starting NestJS application for E2E tests...\n');

  // Iniciar app NestJS uma vez
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app: INestApplication = moduleFixture.createNestApplication();

  // Aplicar as mesmas configurações do main.ts
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.init();

  // Obter a porta do servidor
  const server = app.getHttpServer();
  await new Promise<void>((resolve) => {
    server.listen(3000, () => {
      console.log('✅ Test server listening on http://localhost:3000\n');
      resolve();
    });
  });

  // Salvar referência global para uso nos testes
  (global as any).__APP__ = app;
  (global as any).__BASE_URL__ = 'http://localhost:3000';

  console.log('✅ Global setup completed!\n');
}
