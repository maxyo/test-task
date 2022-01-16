import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ProductController} from "./api/user/product.controller";
import {Product} from "./entity/product.entity";
import {AuthorizationModule} from "../common/authorization/authorization.module";
import {ProductProvider} from "./service/product.provider";

@Module({
  controllers: [
    ProductController
  ],
  providers: [
    ProductProvider,
  ],
  exports: [],
  imports: [
    AuthorizationModule,
    TypeOrmModule.forFeature(
      [Product],
      'default'
    ),
  ]
})
export class ProductModule {

}