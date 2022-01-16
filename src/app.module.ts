import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {getEnvFilesPath} from "../lib/utils/config.utils";
import {TypeOrmModule} from "@nestjs/typeorm";
import {DatabaseType} from "typeorm/driver/types/DatabaseType";
import {ProductModule} from "./product/product.module";
import {TypeOrmModuleOptions} from "@nestjs/typeorm/dist/interfaces/typeorm-options.interface";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: getEnvFilesPath(),
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        host: config.get<string>('DB_HOST'),
        port: config.get<string>('DB_PORT'),
        type: config.get<DatabaseType>('DB_TYPE'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        synchronize: false,
        migrationsRun: true,
        migrationsTableName: `migrations`,
        migrations: [`migrations/*.js`],
        migrationsTransactionMode: 'all',
        autoLoadEntities: true,
      } as TypeOrmModuleOptions),
    }),
    ProductModule,
  ],
  exports: [],
  controllers: [],
  providers: [],
})
export class AppModule {}
