import { DEFAULT_FACTORY_CLASS_METHOD_KEY } from '@nestjs/common/module-utils/constants';
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class Migrations1773814960351 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tutors',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '200',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '200',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
            length: '250',
            isNullable: false,
          },
          {
            name: 'organization_id',
            type: 'int',
            isNullable: false,
          },
        ],
      }),
    );
    await queryRunner.createForeignKey(
      'tutors',
      new TableForeignKey({
        columnNames: ['organization_id'],
        referencedTableName: 'organization',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('tutors');
    if (!table) {
      throw new Error('not found');
    }
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('organization_id') !== -1,
    );

    if (foreignKey) {
      await queryRunner.dropForeignKey('tutors', foreignKey);
    }
    await queryRunner.dropTable('tutors');
  }
}
