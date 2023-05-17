import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateAccountInput } from './dto/user.input.dto';
import { LoginInput } from './dto/auth.input.dto';
import { LoggedUserOutput } from './dto/auth.output.dto';
import { ValidationPipe } from "@nestjs/common";
import { SanitizedUserDTO } from "../transaction/dto/transaction.output";

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  createAccount(
    @Args('payload', new ValidationPipe()) payload: CreateAccountInput,
  ): Promise<User> {
    return this.usersService.createAccount(payload);
  }

  @Mutation(() => LoggedUserOutput)
  login(@Args('payload', new ValidationPipe()) payload: LoginInput): Promise<LoggedUserOutput> {
    return this.usersService.login(payload);
  }

  @Query(() => SanitizedUserDTO, { name: 'account' })
  account(@Args('userId', { type: () => String }) userId: string) {
    return this.usersService.fetchSanitizedUser(userId);
  }
}
