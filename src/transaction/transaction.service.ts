import { BadRequestException, Injectable } from "@nestjs/common";
import { TopupInput, TransferInput, TransactionsQueryInput } from './dto/transaction.input';
import { Transaction, Wallet } from "./entities/transaction.entity";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model, Types } from "mongoose";
import { UsersService } from "../users/users.service";
import { TransactionAndNestedUserOutput, TopupOutput } from "./dto/transaction.output";

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<Transaction>,
    @InjectModel(Wallet.name)
    private readonly walletModel: Model<Wallet>,
    private readonly userService: UsersService,
  ) {
  }
  async topup(data: TopupInput): Promise<TopupOutput> {
    const user = await this.userService.findById(data.userId)

    if (!user) {
      throw new BadRequestException('user not found');
    }

    const wallet = await this.walletModel.create(data)

    return { balance: await this.balance(data.userId)}
  }

  async transfer(data: TransferInput):Promise<Transaction> {

    const recipient = await this.userService.findByEmail(data.email);
    if (!recipient){
      throw new BadRequestException('recipient not found');
    }

    // check balance
    const balance = await this.balance(data.userId)
    if (balance < data.amount){
      throw new BadRequestException('insufficient balance')
    }

    const senderWallet = { amount: -data.amount, user: data.userId };
    const recipientWallet = { amount: data.amount, user: recipient.id };

    await this.walletModel.insertMany([
      senderWallet,
      recipientWallet
    ])

    const transactionObj = { amount: data.amount, sender: data.userId, recipient: recipient.id }

    const transaction = await this.transactionModel.create(transactionObj)

    //TODO: publish to kafka

    return transaction
  }

  async transactions(userId: string, page: number, limit: number):Promise<Array<TransactionAndNestedUserOutput>> {

    const transactions = await this.transactionModel.aggregate([
      {
        $match: {
          $expr: {
            $or: [
              {$eq: ["$sender", userId]},
              {$eq: ["$recipient", userId]}
            ]
          }
        }
      },
      {$skip: (--page)*limit },
      {$limit: limit},
      {
        $lookup: {
          from: 'users',
          let: { userIdString: '$sender' }, // Store the string field value in a variable
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', { $toObjectId: '$$userIdString' }], // Convert string to ObjectId
                },
              },
            },
            {
              $project: { __v: 0, password:0 }
            }
          ],
          as: 'sender',
        }
      },
      {$unwind: { path: '$sender', preserveNullAndEmptyArrays: false }},
      {
        $lookup: {
          from: 'users',
          let: { userIdString: '$recipient' }, // Store the string field value in a variable
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', { $toObjectId: '$$userIdString' }], // Convert string to ObjectId
                },
              },
            },
            {
              $project: { __v: 0, password:0 }
            }
          ],
          as: 'recipient',
        }
      },
      {$unwind: { path: '$recipient', preserveNullAndEmptyArrays: false }},
      {
        $project: {
          id: 1,
          sender:1,
          recipient:1,
          timestamp:1,
          amount:
            {
              $switch:
                {
                  branches: [
                    {
                      case: {$eq: ["$sender._id", { $toObjectId : userId }]},
                      then: {$multiply: ["$amount", -1]}
                    },
                    {
                      case: {$eq: ["$recipient._id", { $toObjectId : userId }]},
                      then: {$multiply: ["$amount", 1]}
                    },
                  ],
                  default: "$amount"
                }
            }
        }
      }
    ])

    return transactions
  }

  async balance(userId: string):Promise<number> {
    const balance = await this.walletModel.aggregate([
      {
        $match: {
          userId: userId
        }
      },
      {
        $group:{
          _id: null,
          amount: {$sum: "$amount"}
        }
      },
      { $project: { _id: 0, amount: 1}}
    ]);

    if (balance.length == 0) {
      return 0
    }
    return balance[0].amount;
  }
}
