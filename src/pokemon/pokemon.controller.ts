import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PokemonResponseDto } from './dto/pokemon-response.dto';

/**
 * PokemonController
 *
 * Controller responsável pelos endpoints CRUD de pokémons.
 * Implementa as operações: CREATE, READ, UPDATE, DELETE
 */
@ApiTags('pokemons')
@Controller('pokemons')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  /**
   * POST /pokemons
   * Cria um novo pokémon
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar um novo pokémon' })
  @ApiBody({ type: CreatePokemonDto })
  @ApiResponse({
    status: 201,
    description: 'Pokémon criado com sucesso',
    type: PokemonResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos (tipo inválido ou dados faltando)',
  })
  async create(
    @Body() createPokemonDto: CreatePokemonDto,
  ): Promise<PokemonResponseDto> {
    return await this.pokemonService.create(createPokemonDto);
  }

  /**
   * GET /pokemons
   * Lista todos os pokémons ativos
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar todos os pokémons' })
  @ApiResponse({
    status: 200,
    description: 'Lista de pokémons retornada com sucesso',
    type: [PokemonResponseDto],
  })
  async findAll(): Promise<PokemonResponseDto[]> {
    return await this.pokemonService.findAll();
  }

  /**
   * GET /pokemons/:id
   * Busca um pokémon por ID
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Buscar pokémon por ID' })
  @ApiParam({ name: 'id', description: 'ID do pokémon', type: String })
  @ApiResponse({
    status: 200,
    description: 'Pokémon encontrado',
    type: PokemonResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Pokémon não encontrado',
  })
  async findOne(@Param('id') id: string): Promise<PokemonResponseDto> {
    return await this.pokemonService.findOne(id);
  }

  /**
   * PUT /pokemons/:id
   * Atualiza o treinador de um pokémon
   */
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Atualizar treinador do pokémon' })
  @ApiParam({ name: 'id', description: 'ID do pokémon', type: String })
  @ApiBody({ type: UpdatePokemonDto })
  @ApiResponse({
    status: 204,
    description: 'Pokémon atualizado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Pokémon não encontrado',
  })
  async update(
    @Param('id') id: string,
    @Body() updatePokemonDto: UpdatePokemonDto,
  ): Promise<void> {
    await this.pokemonService.update(id, updatePokemonDto);
  }

  /**
   * DELETE /pokemons/:id
   * Remove um pokémon (soft delete)
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar pokémon' })
  @ApiParam({ name: 'id', description: 'ID do pokémon', type: String })
  @ApiResponse({
    status: 204,
    description: 'Pokémon deletado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Pokémon não encontrado',
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.pokemonService.remove(id);
  }
}
