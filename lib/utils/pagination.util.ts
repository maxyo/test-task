import {ApiModelProperty} from "@nestjs/swagger/dist/decorators/api-model-property.decorator";

class GetManyResponse<Entity> {
  @ApiModelProperty({type: Object, isArray: true}) // will be overwritten
  public data: Entity[];

  @ApiModelProperty({})
  public page: number;
  @ApiModelProperty({})
  public total: number;
  @ApiModelProperty({})
  public pageCount: number;
  @ApiModelProperty({})
  public count: number;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function getManyResponseDecorator(type: Function): typeof GetManyResponse {
  class GetManyResponseForEntity<Entity> extends GetManyResponse<Entity> {
    @ApiModelProperty({ type, isArray: true })
    public data: Entity[];
  }
  Object.defineProperty(GetManyResponseForEntity, 'name', {
    value: `GetManyResponseFor${type.name}`,
  });

  return GetManyResponseForEntity;
}
