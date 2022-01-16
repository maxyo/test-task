import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
    id: string;
  @Column('varchar')
    name: string;
}
