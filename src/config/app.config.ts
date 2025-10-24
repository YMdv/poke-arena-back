/**
 * App Configuration
 *
 * Configurações gerais da aplicação.
 * Centralize todas as configurações relacionadas ao comportamento da app.
 */

export const appConfig = () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  apiPrefix: process.env.API_PREFIX || '',
  nodeEnv: process.env.NODE_ENV || 'development',

  // Swagger
  swagger: {
    title: process.env.SWAGGER_TITLE || 'PokéArena API',
    description: process.env.SWAGGER_DESCRIPTION || 'API para gerenciamento de pokémons e batalhas',
    version: process.env.SWAGGER_VERSION || '1.0.0',
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'debug',
    format: process.env.LOG_FORMAT || 'json',
  },
});
