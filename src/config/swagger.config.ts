import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Swagger Configuration
 *
 * Configura a documentação automática da API usando OpenAPI/Swagger.
 * Acessível em: /api-docs
 */
export function setupSwagger(
  app: INestApplication,
  configService: ConfigService,
): void {
  const config = new DocumentBuilder()
    .setTitle(configService.get<string>('swagger.title') || 'PokéArena API')
    .setDescription(
      configService.get<string>('swagger.description') ||
        'API para gerenciamento de pokémons e batalhas',
    )
    .setVersion(configService.get<string>('swagger.version') || '1.0.0')
    .addTag('pokemons', 'Operações CRUD de pokémons')
    .addTag('batalhas', 'Sistema de batalhas entre pokémons')
    .addTag('health', 'Health checks da aplicação')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    customSiteTitle: 'PokéArena API Documentation',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: '.swagger-ui .topbar { display: none }',
  });
}
