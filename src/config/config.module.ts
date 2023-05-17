import { Module } from '@nestjs/common';
import { GraphqlModule } from './graphql.module';
import { MongoModule } from './mongo.module';
import { EnvModule } from './env.module';

@Module({
  imports: [EnvModule, GraphqlModule, MongoModule],
  exports: [EnvModule, GraphqlModule, MongoModule],
})
export class ConfigModule {}