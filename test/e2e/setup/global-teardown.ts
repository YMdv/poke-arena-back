/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { INestApplication } from '@nestjs/common';

export default async function globalTeardown() {
  console.log('\n🧹 Tearing down test environment...\n');

  const app: INestApplication = (global as any).__APP__;

  if (app) {
    await app.close();
    console.log('✅ Application closed successfully\n');
  }

  console.log('✅ Global teardown completed!\n');
}
