import { InputType, Field } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsNumber } from "class-validator";
import { User } from "../../users/entities/user.entity";
@InputType()
export class TransferInput {
  @Field(() => Number, { description: 'transfer amount' })
  @IsNumber()
  amount: number;
  @Field(() => String, { description: 'email of the user to receive transfer' })
  @IsEmail()
  email: string;
  @Field(() => String, { description: 'id of the user to make transfer' })
  @IsNotEmpty()
  userId: string;
}

@InputType()
export class TopupInput {
  @Field(() => String, { description: 'id of the user to make topup' })
  @IsNotEmpty()
  userId: string;
  @Field(() => Number, { description: 'topup amount' })
  @IsNumber()
  amount: number;
}

interface TransactionsQueryType {
  userId: string
  page: number
  limit: number
}

export var TransactionsQueryInput: TransactionsQueryType