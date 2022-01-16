import {Connection, EntityMetadata} from "typeorm";
import {glob} from "glob";
import {fsReadFile} from "ts-loader/dist/utils";
import * as Path from "path";

export async function  cleanAll(connection: Connection, entities: EntityMetadata[]) {
  try {
    for (const entity of entities) {
      const repository = connection.getRepository(entity.name);
      await repository.query(`DELETE FROM public.${entity.tableName};`);
    }
  } catch (error) {
    throw new Error(`ERROR: Cleaning test db: ${(error as Error).stack}`);
  }
}

export function loadFixtures(connection: Connection) {
  return new Promise<void>((resolve, reject) => {
    glob('test/fixtures/**/*.json', (e, matches ) => {
      if(e) {
        reject(new Error(`Failed to load fixtures: ${e.message}`))
      } else {
        Promise.all(
          matches.map(fixture => {
            return new Promise((resolve1, reject1) => {
              const baseName = Path.basename(fixture, '.json');
              const data: any[] = JSON.parse(fsReadFile(fixture)) ;
              const repository = connection.getRepository(baseName);
              Promise.all(
                data.map(async item => await repository.save(item))
              )
                .then(resolve1)
                .catch(reject1);
            })
          }))
          .then(() => resolve())
          .catch((e: Error) =>
            reject(new Error(`Failed to load fixtures: ${e.message}`)));
      }
    });
  })
}


export const uuidRegex = /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/;
