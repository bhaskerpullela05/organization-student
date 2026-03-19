import {
  ForeignKey,
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class Migrations1773896803083 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'organization',
      new TableColumn({
        name: 'subscription_id',
        type: 'int',
      }),
    );

    await queryRunner.createForeignKey(
      'organization',
      new TableForeignKey({
        columnNames: ['subscription_id'],
        referencedTableName: 'subscription',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const Table = await queryRunner.getTable('organization');
    if (!Table) {
      throw new Error('table not found');
    }
    const Fk = Table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('subscription_id') !== -1,
    );
    if (Fk) {
      await queryRunner.dropForeignKey('organization', Fk);
    }
  }
}
