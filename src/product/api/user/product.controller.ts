import {Controller} from "@nestjs/common";
import {Crud, CrudController} from "@nestjsx/crud";
import {Product} from "../../entity/product.entity";
import {ProductDto} from "./dto/product.dto";
import {ApiOkResponse, OmitType} from "@nestjs/swagger";
import {ProductProvider} from "../../provider/product.provider";
import {getManyResponseDecorator} from "../../../../lib/utils/pagination.util";

@Controller('/api/product')
@Crud({
  params: {
    id: {
      type: 'uuid',
      primary: true,
      field: 'id',
    },
  },
  routes: {
    getManyBase: {
      decorators: [
        ApiOkResponse({ type: getManyResponseDecorator(Product) })
      ]
    }
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