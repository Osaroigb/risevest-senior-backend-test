import { Order } from './page.dto';
import { Type } from 'class-transformer';
import { FindOptionsOrderValue } from 'typeorm';
import { IsInt, IsEnum, IsOptional, Max, Min } from 'class-validator';

export class PageOptionsDto {
  @IsEnum(Order)
  @IsOptional()
  readonly order?: FindOptionsOrderValue = Order.ASC;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(1000)
  @IsOptional()
  readonly pageSize?: number;

  get skip(): number {
    // use nullish coalescing to provide default values for page and pageSize
    const page = this.page ?? 1;
    const pageSize = this.pageSize ?? 10;

    return (page - 1) * pageSize;
  }
}
