import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import { Transaction } from './entities/transaction.entity';
import { TransferInput, TopupInput } from './dto/transaction.input';
import { TopupOutput, TransactionAndNestedUserOutput } from "./dto/transaction.output";

@Resolver(() => Transaction)
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Mutation(() => TopupOutput)
  topup(@Args('payload') payload: TopupInput) {
    return this.transactionService.topup(payload);
  }

  @Mutation(() => Transaction)
  transfer(@Args('payload') payload: TransferInput): Promise<Transaction> {
    return this.transactionService.transfer(payload);
  }

  @Query(() => [TransactionAndNestedUserOutput], { name: 'transactions' })
  transactions(
    @Args('userId', {type: ()=> String }) userId: string,
    @Args('page', { defaultValue: 1, type: ()=> Int }) page?: number,
    @Args('limit', { defaultValue: 100, type: ()=> Int }) limit?: number,) {
    return this.transactionService.transactions(userId, page, limit);
  }

  // @UseGuards(JwtAuthGuard)
  @Query(() => Number, { name: 'balance' })
  balance(@Args('userId', { type: () => String }) userId: string) {
    return this.transactionService.balance(userId);
  }
}
