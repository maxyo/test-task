import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";
import {uuidExample} from "../../../lib/utils/swagger.util";

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({example: uuidExample})
    id: string;
  @Column('varchar')
  @ApiProperty()
    name: string;
}
