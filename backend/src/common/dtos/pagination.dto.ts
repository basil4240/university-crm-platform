import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsPositive } from "class-validator";

export class PaginationDto {
  @ApiPropertyOptional({
    description: 'The number of items per page.',
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive({ message: 'pageSize must be a positive number.' })
  @IsInt({ message: 'pageSize must be an integer.' })
  readonly pageSize?: number = 20;

  @ApiPropertyOptional({
    description: 'The current page number.',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive({ message: 'page must be a positive number.' })
  @IsInt({ message: 'page must be an integer.' })
  readonly page?: number = 1;
}
