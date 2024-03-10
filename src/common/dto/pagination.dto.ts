/* eslint-disable prettier/prettier */
// import { Type } from 'class-transformer';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';
// export class PaginationDto {
//   @IsOptional()
//   @IsPositive()
//   @IsNumber()
//   @Min(1)
//   // @Type(() => Number)
//   limit?: number;

//   @IsOptional()
//   // @IsPositive()
//   @IsNumber()
//   // @Type(() => Number) //para que la transformacion sea a nivel de DTO
//   offset?: number;
// }
export class PaginationDto {

  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  // @IsPositive()
  // @IsOptional()
  // @Type(() => Number)
  // offset?: number = 0;
}