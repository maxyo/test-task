import {Product} from "../entity/product.entity";
import {TypeOrmCrudService} from "@nestjsx/crud-typeorm";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class ProductProvider extends TypeOrmCrudService<Product>{
  constructor(
        @InjectRepository(Product) repo: Repository<Product>
  ) {
    super(repo);
  }
}