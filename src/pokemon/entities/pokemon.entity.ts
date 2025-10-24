import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { PokemonType } from '../enums/pokemon-type.enum';

/**
 * Pokemon Entity
 *
 * Representa um pokémon no sistema.
 * Herda campos de BaseEntity: id, created_at, updated_at, active
 *
 * Campos específicos:
 * - tipo: Tipo do pokémon (charizard, mewtwo, pikachu)
 * - treinador: Nome do treinador
 * - nivel: Nível do pokémon (inicia em 1)
 */
@Entity('pokemon')
export class Pokemon extends BaseEntity {
  @Column({
    type: 'enum',
    enum: PokemonType,
  })
  tipo: PokemonType;

  @Column({
    type: 'varchar',
    length: 255,
  })
  treinador: string;

  @Column({
    type: 'int',
    default: 1,
  })
  nivel: number;
}
