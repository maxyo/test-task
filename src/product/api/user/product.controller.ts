import {Controller, UseGuards} from "@nestjs/common";
import {Crud, CrudController} from "@nestjsx/crud";
import {Product} from "../../entity/product.entity";
import {ProductDto} from "./dto/product.dto";
import {ApiOkResponse, OmitType} from "@nestjs/swagger";
import {getManyResponseDecorator} from "../../../../lib/utils/pagination.util";
import {AuthGuard} from "@nestjs/passport";
import {ProductProvider} from "../../service/product.provider";

@Controller('/api/product')
@Crud({
  params: {
    id: {
      type: 'uuid',
      primary: true,
      field: 'id',
    },
  },
  query: {
    cache: 1000,
    alwaysPaginate: true
  },
  routes: {
    exclude: [
      'updateOneBase',
      'recoverOneBase',
      'createManyBase'
    ],
    getManyBase: {
      decorators: [
        ApiOkResponse({ type: getManyResponseDecorator(Product) })
      ],
      interceptors: [
      ],
    },
    createOneBase: {
      decorators: [
        UseGuards(AuthGuard())
      ]
    },
    deleteOneBase: {
      decorators: [
        UseGuards(AuthGuard())
      ]
    },
    replaceOneBase: {
      decorators: [
        UseGuards(AuthGuard())
      ]
    },
  },
  dto: {
    create: OmitType(ProductDto, ['id']),
    update: OmitType(ProductDto, ['id']),
    replace: OmitType(ProductDto, ['id']),
  },
  model: {
    type: Product
  },
})
export class ProductController implements CrudController<Product> {
  constructor(public service: ProductProvider) {
  }
  get base(): CrudController<Product> {
    return this;
  }
}