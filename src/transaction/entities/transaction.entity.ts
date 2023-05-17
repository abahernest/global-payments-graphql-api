import { ObjectType, Field } from '@nestjs/graphql';
import { Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../users/entities/user.entity';

import * as mongoose from 'mongoose';


@Schema()
@ObjectType()
export class Transaction {
  @Field(() => String)
  id: MongooseSchema.Types.ObjectId;

  @Prop()
  @Field(() => String, { description: 'sender information' })
  sender: string;

  @Prop()
  @Field(() => String, { description: 'recipient information' })
  recipient: string;

  @Prop()
  @Field(() => Number, { description: 'transaction amount' })
  amount: number;

  @Prop({default: Date.now()})
  @Field(()=> Date, { description: 'transaction date' })
  timestamp: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);


@Schema()
@ObjectType()
export class Wallet {
  @Field(() => String)
  id: MongooseSchema.Types.ObjectId;

  @Prop()
  @Field(() => String, { description: 'user information' })
  userId: string;

  @Prop()
  @Field(() => Number, { description: 'transaction amount' })
  amount: number;

  @Prop({default: Date.now()})
  @Field(()=> Date, { description: 'transaction date' })
  timestamp: Date;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);