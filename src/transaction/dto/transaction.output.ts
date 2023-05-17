import { Field, ID, ObjectType } from "@nestjs/graphql";
import { IsNumber } from "class-validator";
import mongoose, { Schema as MongooseSchema } from "mongoose";
import { Prop } from "@nestjs/mongoose";

@ObjectType()
export class TopupOutput {
  @Field(() => Number, { description: 'account balance' })
  @IsNumber()
  balance: number;
}

@ObjectType()
export class SanitizedUserDTO {
  @Field((type) => ID)
  _id: string;

  @Field()
  name: string;

  @Field()
  email: string;
}

@ObjectType()
export class TransactionAndNestedUserOutput {

  @Field(() => ID)
  _id: string;

  @Prop()
  @Field(() => SanitizedUserDTO, { description: 'sender information' })
  sender: SanitizedUserDTO;

  @Prop()
  @Field(() => SanitizedUserDTO, { description: 'recipient information' })
  recipient: SanitizedUserDTO;

  @Prop()
  @Field(() => Number, { description: 'transaction amount' })
  amount: number;

  @Prop({default: Date.now()})
  @Field(()=> Date, { description: 'transaction date' })
  timestamp: Date;
}
