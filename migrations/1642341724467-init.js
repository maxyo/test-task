const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class init1642341724467 {
    name = 'init1642341724467'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "product"`);
    }
}
