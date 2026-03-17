import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class Migrations1773216756947 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "student",
            new TableColumn({
                name:"email_verified",
                type:"Boolean",
                isNullable:true,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("student", "email_verified");
    }

}
