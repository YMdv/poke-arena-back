import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { PokemonType } from '../enums/pokemon-type.enum';

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
