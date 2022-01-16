import {OmitType, PartialType} from "@nestjs/swagger";
import {Product} from "../../../entity/product.entity";

export class ProductDto extends PartialType(Product) {

}