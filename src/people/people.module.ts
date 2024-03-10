import { Module } from "@nestjs/common"
import { PeopleService } from "./people.service"
import { PeopleController } from "./people.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Person, PersonSchema } from "./entities/person.entity";
import { ConfigModule } from "@nestjs/config";
import { NatsModule } from "src/transports/nats.module";

// eslint-disable-next-line prettier/prettier
@Module({
  controllers: [PeopleController],
  providers: [PeopleService],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Person.name, schema: PersonSchema }]),
    NatsModule
  ],
  exports: [MongooseModule],
})
export class PeopleModule { }

