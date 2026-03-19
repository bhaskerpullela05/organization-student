import { table } from 'console';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Migrations1773896738229 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'subscription',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'plan_name',
            type: 'varchar',
            length: '250',
          },
          {
            name: 'max_users',
            type: 'int',
          },
          {
            name: 'expires_at',
            type: 'datetime',
          },
          {
            name: 'status',
            type: 'varchar',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('subscription');
  }
}
