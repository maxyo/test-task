const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class user1642346767434 {
    name = 'user1642346767434'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "user"`);
    }
}
