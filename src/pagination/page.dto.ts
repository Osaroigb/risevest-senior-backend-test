import { IsArray } from 'class-validator';
import { PageMetaDto } from './page-meta.dto';
import { PageOptionsDto } from './page-options.dto';

export class PageDto<T> {
  @IsArray()
  readonly data: T[];

  readonly meta: PageMetaDto;

  constructor(data: T[], totalCount: number, pageOptions: PageOptionsDto) {
    this.data = data;
    this.meta = new PageMetaDto(pageOptions, totalCount);
  }
}

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}
