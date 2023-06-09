import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsEmail, Matches, MinLength } from "class-validator";
@InputType()
export class CreateAccountInput {
  @Field(() => String, { description: 'first name of the user' })
  @IsNotEmpty()
  name: string;
  @Field(() => String, { description: 'email of the user' })
  @IsEmail()
  email: string;
  @Field(() => String, { description: 'password of the user' })
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-_=+{};:,<.>]).*$/, {
    message: 'password must contain at least 1 lowercase, 1 uppercase, 1 special character, and 1 number',
  })
  password: string;
}