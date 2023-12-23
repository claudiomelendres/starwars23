import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { Person } from './entities/person.entity';
import { Model } from 'mongoose';
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

  findAll() {
    return `This action returns all people`;
  }

  findOne(id: number) {
    return `This action returns a #${id} person`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updatePersonDto: UpdatePersonDto) {
    return `This action updates a #${id} person`;
  }

  remove(id: number) {
    return `This action removes a #${id} person`;
  }
}
