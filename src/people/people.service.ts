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

  findAll() {
    return `This action returns all people`;
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

  remove(id: number) {
    return `This action removes a #${id} person`;
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
