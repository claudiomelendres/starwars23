/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  HttpStatus,
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
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class PeopleService {

  private defaultLimit: number;
  constructor(
    @InjectModel(Person.name)
    private personModel: Model<Person>,
    private readonly configService: ConfigService,
  ) {
    // console.log(process.env.DEFAULT_LIMIT)
    this.defaultLimit = this.configService.get<number>('defaultLimit');
    //   console.log(this.defaultLimit);
  }

  async create(createPersonDto: CreatePersonDto) {
    createPersonDto.name = createPersonDto.name.toLocaleLowerCase();

    try {
      const person = await this.personModel.create(createPersonDto);
      return person;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(paginationQuery: PaginationDto) {
    const { limit = this.defaultLimit, page } = paginationQuery;

    const totalPages = await this.personModel.countDocuments();
    const lastPage = Math.ceil(totalPages / limit);
    console.log({ totalPages, lastPage, limit, page });
    return {
      data: await
        this.personModel
          .find()
          .skip((page - 1) * limit)
          .limit(limit)
          .sort({ no: 1 })
          .select('-__v'),
      meta: {
        total: totalPages,
        page,
        lastPage,
      },

    }
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
