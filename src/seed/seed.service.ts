import { Injectable } from '@nestjs/common';
import { PeopleResponse } from './interfaces/people-responce.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Person } from 'src/people/entities/person.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Person.name)
    private personModel: Model<Person>,
    private readonly http: AxiosAdapter,
    private readonly httpService: HttpService,
  ) {}

  totalPages = 8;
  peopleArray: { name: string; no: number }[] = [];

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

  async executeSEED2() {
    await this.personModel.deleteMany({});
    const peopleArray: { name: string; no: number }[] = [];

    const totalPages = 9;

    for (let page = 1; page <= totalPages; page++) {
      const url = `https://swapi.dev/api/people/?page=${page}`;

      const { data } = await firstValueFrom(
        this.httpService.get<PeopleResponse>(url),
      );

      data.results.forEach(async ({ name, url }) => {
        const segments = url.split('/');
        const no = +segments[segments.length - 2];

        peopleArray.push({ name, no });

        console.log({ name, no });
      });
    }
    await this.personModel.insertMany(peopleArray);
    return 'seed executed2';
  }

  getPageData = async (page) => {
    const url = `https://swapi.dev/api/people/?page=${page}`;
    const { data } = await firstValueFrom(
      this.httpService.get<PeopleResponse>(url),
    );

    return data.results.map(({ name, url }) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];
      return { name, no };
    });
  };

  fetchAllPages = async () => {
    const promises = [];
    for (let page = 1; page <= this.totalPages; page++) {
      promises.push(this.getPageData(page));
    }
    const results = await Promise.all(promises);
    // Flatten the array of arrays into a single array
    this.peopleArray.push(...results.flat());
    await this.personModel.insertMany(this.peopleArray);
    // // Optionally, you can log or use the data here
    // this.peopleArray.forEach(({ name, no }) => {
    //   console.log({ name, no });
    // });
  };

  async executeSEED3() {
    await this.personModel.deleteMany({});
    // Call the function to start the process
    await this.fetchAllPages();

    return 'seed executed2';
  }
}
