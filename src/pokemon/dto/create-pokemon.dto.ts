import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PokemonType } from '../enums/pokemon-type.enum';

/**
 * CreatePokemonDto
 *
 * DTO para criação de um novo pokémon.
 * Valida os dados de entrada da requisição POST /pokemons
 */
export class CreatePokemonDto {
  @ApiProperty({
    description: 'Tipo do pokémon',
    enum: PokemonType,
    example: PokemonType.PIKACHU,
  })
  @IsEnum({
    enum: PokemonType,
    message: `Tipo inválido. Valores permitidos: ${Object.values(
      PokemonType,
    ).join(', ')}`,
  })
  tipo: PokemonType;

  @ApiProperty({
    description: 'Nome do treinador',
    example: 'Thiago',
    maxLength: 255,
  })
  @IsString({ message: 'Treinador deve ser uma string' })
  @IsNotEmpty({ message: 'Treinador é obrigatório' })
  @MaxLength(255, { message: 'Treinador deve ter no máximo 255 caracteres' })
  treinador: string;
}
