import {Connection, EntityMetadata} from "typeorm";

export async function  cleanAll(connection: Connection, entities: EntityMetadata[]) {
  try {
    for (const entity of entities) {
      const repository = connection.getRepository(entity.name);
      await repository.query(`DELETE FROM ${entity.tableName};`);
    }
  } catch (error) {
    throw new Error(`ERROR: Cleaning test db: ${(error as Error).stack}`);
  }
}


export const uuidRegex = /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/;
