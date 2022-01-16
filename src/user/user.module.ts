import {Module} from "@nestjs/common";
import {AuthController} from "./api/user/auth.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./entity/user.entity";
import {AuthorizationModule} from "../common/authorization/authorization.module";
import {AuthService} from "./service/auth.service";


@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AuthorizationModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [],
})
export class UserModule {

}