import { ApiProperty } from '@nestjs/swagger';
import { PokemonResponseDto } from '../../pokemon/dto/pokemon-response.dto';

/**
 * BattleResultDto
 *
 * DTO para resposta do endpoint de batalha.
 * Retorna informações do vencedor e perdedor após a batalha.
 */
export class BattleResultDto {
  @ApiProperty({
    description: 'Pokémon vencedor da batalha',
    type: PokemonResponseDto,
  })
  vencedor: PokemonResponseDto;

  @ApiProperty({
    description: 'Pokémon perdedor da batalha',
    type: PokemonResponseDto,
  })
  perdedor: PokemonResponseDto;
}
