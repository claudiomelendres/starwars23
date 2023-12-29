import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { PeopleModule } from "./people/people.module";
import { MongooseModule } from "@nestjs/mongoose";
import { CommonModule } from "./common/common.module";
import { SeedModule } from "./seed/seed.module";
import { ConfigModule } from "@nestjs/config";
import { EnvConfiguration } from "./config/env.config";
import { JoiValidationSchema } from "./config/joi.validation";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfiguration],
      validationSchema: JoiValidationSchema,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "public"),
    }),
    MongooseModule.forRoot(process.env.MONGODB),
    PeopleModule,
    CommonModule,
    SeedModule,
  ],
})
export class AppModule {
  // constructor() {
  //   console.log("AppModule");
  //   console.log(process.env);
  // }
}
