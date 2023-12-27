/* eslint-disable prettier/prettier */
// import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';
export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @IsNumber()
  @Min(1)
  // @Type(() => Number)
  limit?: number;

  @IsOptional()
  // @IsPositive()
  @IsNumber()
  // @Type(() => Number) //para que la transformacion sea a nivel de DTO
  offset?: number;
}
