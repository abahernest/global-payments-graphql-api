import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, Matches, MinLength } from "class-validator";

@InputType()
export class LoginInput {
  @Field(() => String, { description: 'email of the user' })
  email: string;
  @Field(() => String, { description: 'password of the user' })
  password: string;
}