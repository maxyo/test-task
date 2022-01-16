import {Connection, EntityMetadata} from "typeorm";
import {glob} from "glob";
import {fsReadFile} from "ts-loader/dist/utils";
import * as Path from "path";
import {ConfigService} from "@nestjs/config";

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

export function loadFixtures(connection: Connection, entities: EntityMetadata[]) {
  return new Promise<void>((resolve, reject) => {
    glob('test/fixtures/**/*.json', (e, matches ) => {
      if(e) {
        reject(new Error(`Failed to load fixtures: ${e.message}`))
      } else {
        Promise.all(
          matches.map(fixture => {
            return new Promise((resolve1, reject1) => {
              const baseName = Path.basename(fixture, '.json');
              if(!entities.find(entity => entity.name === baseName)) {
                resolve();
              }
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


export function customConfigFactory(config: Record<string, any>) {
  return (configService: ConfigService) => {
    return {
      get: (key: string, defaultValue: any = undefined): any => {
        if(config[key]) {
          return config[key] || defaultValue;
        }
        return configService.get(key, defaultValue);
      }
    };
  }
}