import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from './config/config.module';
import { TransactionModule } from "./transaction/transaction.module";

@Module({
  imports: [ConfigModule, UsersModule, TransactionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
