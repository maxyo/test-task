import * as dotenv from 'dotenv';
import {getEnvFilesPath} from "./lib/utils/config.utils";
import {TypeOrmModuleOptions} from "@nestjs/typeorm/dist/interfaces/typeorm-options.interface";

getEnvFilesPath().forEach(path => dotenv.config({path}));
export = {
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,

  migrationsTableName: `migrations`,
  entities: [
    `src/**/**/*.entity.ts`,
    `src/product/entity/product.entity.ts`,
  ],
  migrations: [`migrations/*.js`],
  cli: {
    migrationsDir: `migrations`,
  },
} as TypeOrmModuleOptions;
