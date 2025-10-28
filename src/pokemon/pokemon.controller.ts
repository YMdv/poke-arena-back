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
  ParseIntPipe,
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

@ApiTags('pokemons')
@Controller('pokemons')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

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
  async create(@Body() createPokemonDto: CreatePokemonDto) {
    return await this.pokemonService.create(createPokemonDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar todos os pokémons' })
  @ApiResponse({
    status: 200,
    description: 'Lista de pokémons retornada com sucesso',
    type: [PokemonResponseDto],
  })
  async findAll() {
    return await this.pokemonService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Buscar pokémon por ID' })
  @ApiParam({ name: 'id', description: 'ID do pokémon', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Pokémon encontrado',
    type: PokemonResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Pokémon não encontrado',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.pokemonService.findOne(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Atualizar treinador do pokémon' })
  @ApiParam({ name: 'id', description: 'ID do pokémon', type: Number })
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
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePokemonDto: UpdatePokemonDto,
  ) {
    await this.pokemonService.update(id, updatePokemonDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar pokémon' })
  @ApiParam({ name: 'id', description: 'ID do pokémon', type: Number })
  @ApiResponse({
    status: 204,
    description: 'Pokémon deletado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Pokémon não encontrado',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.pokemonService.remove(id);
  }
}
