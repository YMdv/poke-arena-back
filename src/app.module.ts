import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { appConfig } from './config/app.config';
import { getDatabaseConfig } from './config/database.config';
import { PokemonModule } from './pokemon/pokemon.module';
import { BattleModule } from './battle/battle.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    // Config Module - Carrega variáveis de ambiente
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: '.env',
    }),

    // TypeORM Module - Conexão com banco de dados
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        getDatabaseConfig(configService),
    }),

    // Módulos de domínio
    PokemonModule,
    BattleModule,
    HealthModule,
  ],
})
export class AppModule {}
