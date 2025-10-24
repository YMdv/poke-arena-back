import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PokemonController } from './pokemon.controller';
import { PokemonService } from './pokemon.service';
import { Pokemon } from './entities/pokemon.entity';

/**
 * PokemonModule
 *
 * Módulo responsável por gerenciar tudo relacionado a pokémons.
 * Exporta o PokemonService para ser usado em outros módulos (ex: BattleModule).
 */
@Module({
  imports: [TypeOrmModule.forFeature([Pokemon])],
  controllers: [PokemonController],
  providers: [PokemonService],
  exports: [PokemonService], // Exporta para uso no BattleModule
})
export class PokemonModule {}
