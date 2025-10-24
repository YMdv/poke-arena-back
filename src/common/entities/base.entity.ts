import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  Index,
} from 'typeorm';

/**
 * BaseEntity - Classe abstrata para entidades
 *
 * Contém campos comuns a todas as entidades do sistema:
 * - id: Identificador único
 * - created_at: Data de criação
 * - updated_at: Data da última atualização
 * - active: Flag para soft delete
 *
 * Todas as entidades do domínio devem estender esta classe
 * para garantir consistência e padronização.
 */
export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Index({
    unique: true,
  })
  id: string;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    nullable: false,
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
    nullable: false,
  })
  updated_at: Date;

  @Column({
    type: 'boolean',
    default: true,
  })
  active: boolean;
}
