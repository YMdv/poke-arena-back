import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * UpdatePokemonDto
 *
 * DTO para atualização de um pokémon existente.
 * Apenas o campo 'treinador' pode ser alterado conforme requisitos.
 * Valida os dados de entrada da requisição PUT /pokemons/:id
 */
export class UpdatePokemonDto {
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
