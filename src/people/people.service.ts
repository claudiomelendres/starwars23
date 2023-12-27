import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { Person } from './entities/person.entity';
import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class PeopleService {
  constructor(
    @InjectModel(Person.name)
    private personModel: Model<Person>,
  ) {}

  async create(createPersonDto: CreatePersonDto) {
    createPersonDto.name = createPersonDto.name.toLocaleLowerCase();

    try {
      const person = await this.personModel.create(createPersonDto);
      return person;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll(paginationQuery: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationQuery;
    return this.personModel
      .find()
      .limit(limit)
      .skip(offset)
      .sort({ no: 1 })
      .select('-__v');
  }

  async findOne(id: string) {
    let person: Person;

    if (!isNaN(+id)) {
      person = await this.personModel.findOne({ no: id });
    }

    // MongoId
    if (!person && isValidObjectId(id)) {
      person = await this.personModel.findById(id);
    }

    // Name
    if (!person) {
      person = await this.personModel.findOne({
        name: id.toLowerCase().trim(),
      });
    }

    if (!person) throw new NotFoundException(`Person with id ${id} not found`);
    return person;
  }

  async update(id: string, updatePersonDto: UpdatePersonDto) {
    const person = await this.findOne(id);
    if (updatePersonDto.name)
      updatePersonDto.name = updatePersonDto.name.toLocaleLowerCase();

    try {
      await person.updateOne(updatePersonDto);
      return { ...person.toJSON(), ...updatePersonDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    // const person = await this.findOne(id);
    // await person.deleteOne();
    // return { id };

    // const result = await this.personModel.findByIdAndDelete(id);
    // return result;

    const { deletedCount } = await this.personModel.deleteOne({ _id: id });
    if (deletedCount === 0)
      throw new NotFoundException(`Person with id ${id} not found`);
    return { id };
  }

  // para manejar el error de duplicidad de datos
  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Person already exists ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `person was not created review server logs`,
    );
  }
}
