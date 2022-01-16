import {Module} from "@nestjs/common";
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {JwtStrategy} from "./service/jwt.strategy";
import {SignService} from "./service/sign.service";

export const passportModule = PassportModule.register({
  defaultStrategy: 'jwt',
});

@Module({
  imports: [
    passportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET')
      })
    }),
  ],
  providers: [
    SignService,
    {
      provide: JwtStrategy,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => new JwtStrategy(configService.get('JWT_SECRET')),
    },
  ],
  exports: [
    SignService,
    passportModule,
  ],
})

export class AuthorizationModule {

}