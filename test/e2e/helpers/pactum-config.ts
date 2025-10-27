/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { request } from 'pactum';

// Configurar Pactum antes de todos os testes
const baseUrl = (global as any).__BASE_URL__ || 'http://localhost:3000';

// Configurações globais
request.setBaseUrl(baseUrl);

// Default headers
request.setDefaultHeaders({
  'Content-Type': 'application/json',
  Accept: 'application/json',
});

// Timeout
request.setDefaultTimeout(10000);

console.log(`📡 Pactum configured with base URL: ${baseUrl}\n`);
