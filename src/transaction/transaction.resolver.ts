import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import { Transaction } from './entities/transaction.entity';
import { TransferInput, TopupInput } from './dto/transaction.input';
import { TopupOutput, TransactionAndNestedUserOutput } from "./dto/transaction.output";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../users/jwt-auth.guard";
import { CurrentUser } from "../users/auth.decorators";
import { IsEmail } from "class-validator";
import { EmailValidationPipe } from "../users/user.validation";
import { TransactionAmountValidationPipe } from "./transaction.validation";

@Resolver(() => Transaction)
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => TopupOutput)
  topup(
    @Args('amount', new TransactionAmountValidationPipe()) amount: number,
    @CurrentUser() user: CurrentUser
    ) {
    const payload:TopupInput = {amount,userId:user.id}
    return this.transactionService.topup(payload);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Transaction)
  transfer(
    @Args('amount', new TransactionAmountValidationPipe()) amount: number,
    @Args('email', new EmailValidationPipe()) email: string,
    @CurrentUser() user: CurrentUser
  ) {
    const payload: TransferInput = { amount,email,userId:user.id };
    return this.transactionService.transfer(payload);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [TransactionAndNestedUserOutput], { name: 'transactions' })
  transactions(
    @CurrentUser() user: CurrentUser,
    @Args('page', { defaultValue: 1, type: ()=> Int }) page?: number,
    @Args('limit', { defaultValue: 100, type: ()=> Int }) limit?: number
  ) {
    return this.transactionService.transactions(user.id, page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Number, { name: 'balance' })
  balance(@CurrentUser() user: CurrentUser) {
    return this.transactionService.balance(user.id);
  }
}
