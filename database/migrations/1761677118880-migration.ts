import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1761677118880 implements MigrationInterface {
  name = 'Migration1761677118880';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."pokemon_tipo_enum" AS ENUM('charizard', 'mewtwo', 'pikachu')`,
    );
    await queryRunner.query(
      `CREATE TABLE "pokemon" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "active" boolean NOT NULL DEFAULT true, "tipo" "public"."pokemon_tipo_enum" NOT NULL, "treinador" character varying(255) NOT NULL, "nivel" integer NOT NULL DEFAULT '1', CONSTRAINT "PK_0b503db1369f46c43f8da0a6a0a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_0b503db1369f46c43f8da0a6a0" ON "pokemon" ("id") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0b503db1369f46c43f8da0a6a0"`,
    );
    await queryRunner.query(`DROP TABLE "pokemon"`);
    await queryRunner.query(`DROP TYPE "public"."pokemon_tipo_enum"`);
  }
}
