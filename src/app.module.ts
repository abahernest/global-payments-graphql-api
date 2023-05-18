import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from './config/config.module';
import { TransactionModule } from "./transaction/transaction.module";
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [

    ConfigModule, UsersModule, TransactionModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
