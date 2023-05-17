import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateAccountInput } from './dto/user.input.dto';
import { LoginInput } from './dto/auth.input.dto';
import { LoggedUserOutput } from './dto/auth.output.dto';
import { UseGuards, ValidationPipe } from "@nestjs/common";
import { SanitizedUserDTO } from "../transaction/dto/transaction.output";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { CurrentUser } from "./auth.decorators";
import { EmailValidationPipe, PasswordValidationPipe } from "./user.validation";

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  createAccount(
    @Args('name', { type: ()=> String, nullable: false }) name: string,
    @Args('email', new EmailValidationPipe()) email: string,
    @Args('password', new PasswordValidationPipe()) password: string,
  ) {
    const payload: CreateAccountInput = { name, email, password }
    return this.usersService.createAccount(payload);
  }

  @Mutation(() => LoggedUserOutput)
  login(
    @Args('email', new EmailValidationPipe()) email: string,
    @Args('password', new PasswordValidationPipe()) password: string,
    ) {
    const payload: LoginInput = { email, password }
    return this.usersService.login(payload);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => SanitizedUserDTO, { name: 'account' })
  account(
    @CurrentUser() user: CurrentUser
  ) {
    return this.usersService.fetchSanitizedUser(user.email);
  }
}
