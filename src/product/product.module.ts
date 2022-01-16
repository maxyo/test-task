import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ProductController} from "./api/user/product.controller";
import {Product} from "./entity/product.entity";
import {ProductProvider} from "./provider/product.provider";

@Module({
  controllers: [
    ProductController
  ],
  providers: [
    ProductProvider,
  ],
  exports: [],
  imports: [
    TypeOrmModule.forFeature(
      [Product],
      'default'
    ),
  ]
})
export class ProductModule {

}