import { Injectable } from '@nestjs/common';
import { PeopleResponse } from './interfaces/people-responce.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Person } from 'src/people/entities/person.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Person.name)
    private personModel: Model<Person>,
    private readonly http: AxiosAdapter,
  ) {}

  async executeSeed() {
    await this.personModel.deleteMany({});
    const peopleArray: { name: string; no: number }[] = [];

    for (let index = 1; index <= 9; index++) {
      const data = await this.http.get<PeopleResponse>(
        'https://swapi.dev/api/people/?page=' + index,
      );

      data.results.forEach(async ({ name, url }) => {
        const segments = url.split('/');
        const no = +segments[segments.length - 2];

        peopleArray.push({ name, no });

        console.log({ name, no });
      });
    }

    await this.personModel.insertMany(peopleArray);
    return 'seed executed';
  }
}
