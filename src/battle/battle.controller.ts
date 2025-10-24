import {
  Controller,
  Post,
  Param,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { BattleService } from './battle.service';
import { BattleResultDto } from './dto/battle-result.dto';

/**
 * BattleController
 *
 * Controller responsável pelo endpoint de batalhas entre pokémons.
 */
@ApiTags('batalhas')
@Controller('batalhar')
export class BattleController {
  constructor(private readonly battleService: BattleService) {}

  /**
   * POST /batalhar/:pokemonAId/:pokemonBId
   * Realiza uma batalha entre dois pokémons
   */
  @Post(':pokemonAId/:pokemonBId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Batalhar entre dois pokémons' })
  @ApiParam({
    name: 'pokemonAId',
    description: 'ID do primeiro pokémon',
    type: Number,
  })
  @ApiParam({
    name: 'pokemonBId',
    description: 'ID do segundo pokémon',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Batalha realizada com sucesso',
    type: BattleResultDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos (pokémon batalha consigo mesmo)',
  })
  @ApiResponse({
    status: 404,
    description: 'Um ou ambos pokémons não encontrados',
  })
  async battle(
    @Param('pokemonAId', ParseIntPipe) pokemonAId: number,
    @Param('pokemonBId', ParseIntPipe) pokemonBId: number,
  ): Promise<BattleResultDto> {
    return await this.battleService.battle(pokemonAId, pokemonBId);
  }
}
