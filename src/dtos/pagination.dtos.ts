import { ApiPropertyOptional } from '@nestjs/swagger';
import { TransformToNumber } from '@transformers/number.transform';
import { TransformToMongooseOrderBy } from '@transformers/query.transformers';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional({
    name: 'page',
    description: 'What paginated page to return',
    type: 'number',
  })
  @Transform(({ value }) => TransformToNumber(value, 'page'))
  @IsOptional()
  page: number;

  @ApiPropertyOptional({
    name: 'limit',
    description: 'How many items to return per page',
    type: 'number',
  })
  @IsOptional()
  @Transform(({ value }) => TransformToNumber(value, 'limit'))
  limit: number;

  @ApiPropertyOptional({
    name: 'order',
    description: "What field and value to order by. E.g 'id,asc' or 'id,desc'",
    type: 'string',
  })
  @IsOptional()
  @Transform(({ value }) => TransformToMongooseOrderBy(value, 'order'))
  order: any;
}
