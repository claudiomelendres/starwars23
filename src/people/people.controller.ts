import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { PeopleService } from './people.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) { }

  // @Post()
  // @HttpCode(HttpStatus.OK)

  @MessagePattern({ cmd: 'create_person' })
  create(@Payload() createPersonDto: CreatePersonDto) {
    return this.peopleService.create(createPersonDto);
  }

  // @Get()
  @MessagePattern({ cmd: 'find_all_people' })
  findAll(@Payload() paginationQuery: PaginationDto) {
    return this.peopleService.findAll(paginationQuery);
  }

  // @Get(':id')
  @MessagePattern({ cmd: 'find_one_person' })
  async findOne(@Param('id') id: string) {
    return this.peopleService.findOne(id);
  }

  // @Patch(':id')
  @MessagePattern({ cmd: 'update_person' })
  update(@Param('id') id: string, @Body() updatePersonDto: UpdatePersonDto) {
    return this.peopleService.update(id, updatePersonDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.peopleService.remove(id);
  }
}
