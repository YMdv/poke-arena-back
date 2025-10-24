import { Module } from '@nestjs/common';
import { BattleController } from './battle.controller';
import { BattleService } from './battle.service';
import { PokemonModule } from '../pokemon/pokemon.module';

/**
 * BattleModule
 *
 * Módulo responsável por gerenciar batalhas entre pokémons.
 * Importa PokemonModule para acessar PokemonService.
 */
@Module({
  imports: [PokemonModule],
  controllers: [BattleController],
  providers: [BattleService],
})
export class BattleModule {}
