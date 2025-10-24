import { ApiProperty } from '@nestjs/swagger';
import { PokemonType } from '../enums/pokemon-type.enum';

/**
 * PokemonResponseDto
 *
 * DTO para resposta de requisições relacionadas a pokémons.
 * Define o formato de retorno dos endpoints.
 */
export class PokemonResponseDto {
  @ApiProperty({
    description: 'ID do pokémon',
    example: 'uuid-1234-5678-9012',
  })
  id: string;

  @ApiProperty({
    description: 'Tipo do pokémon',
    enum: PokemonType,
    example: PokemonType.PIKACHU,
  })
  tipo: PokemonType;

  @ApiProperty({
    description: 'Nome do treinador',
    example: 'Thiago',
  })
  treinador: string;

  @ApiProperty({
    description: 'Nível do pokémon',
    example: 1,
  })
  nivel: number;
}
