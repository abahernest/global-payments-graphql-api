import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionResolver } from './transaction.resolver';
import { ConfigModule } from "../config/config.module";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../users/entities/user.entity";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Transaction, TransactionSchema, Wallet, WalletSchema } from "./entities/transaction.entity";
import { UsersService } from "../users/users.service";
import { AuthService } from "../users/auth.service";

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: Transaction.name,
        schema: TransactionSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: Wallet.name,
        schema: WalletSchema,
      },
    ]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60s' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [TransactionResolver, TransactionService, UsersService, AuthService]
})
export class TransactionModule {}
