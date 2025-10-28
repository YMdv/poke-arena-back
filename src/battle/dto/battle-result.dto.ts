import { ApiProperty } from '@nestjs/swagger';
import { PokemonResponseDto } from '../../pokemon/dto/pokemon-response.dto';

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
