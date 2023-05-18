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
import { AuthService } from "../auth/auth.service";
import { JwtStrategy } from "../auth/jwt.strategy";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { GetKafkaConfig } from "../config/kafka.config";

const kafkaconfig = GetKafkaConfig();

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
    ClientsModule.register([
      {
        name: 'GLOBAL_PAYMENT_PRODUCER',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'global-payment-producer',
            brokers: [kafkaconfig.BOOTSTRAP_SERVERS],
            ssl: true,
            sasl: {
              mechanism: 'plain',
              username: kafkaconfig.SASL_USERNAME,
              password: kafkaconfig.SASL_PASSWORD,
            },
          },
          consumer: {
            groupId: 'global-payments'
          },
        },
      }
    ]),
  ],
  providers: [TransactionResolver, TransactionService, UsersService, AuthService, JwtStrategy]
})
export class TransactionModule {}
