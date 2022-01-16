import {Module} from "@nestjs/common";
import {JwtModule} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {AuthController} from "./api/user/auth.controller";
import {AuthService} from "./service/auth.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./entity/user.entity";

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET')
      })
    }),
    TypeOrmModule.forFeature([User])
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [],
})
export class UserModule {

}