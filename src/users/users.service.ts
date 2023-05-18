import { Injectable, NotFoundException, HttpException, BadRequestException, Inject, forwardRef } from "@nestjs/common";
import { CreateAccountInput } from './dto/user.input.dto';
import { LoggedUserOutput } from '../auth/dto/auth.output.dto';
import { LoginInput } from '../auth/dto/auth.input.dto';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';
import { SanitizedUserDTO } from "../transaction/dto/transaction.output";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly authService: AuthService,
  ) {}
  async createAccount(data: CreateAccountInput):Promise<User> {
    let user = await this.findByEmail(data.email);
    if (!user) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      data.password = hashedPassword;
      user = await this.userModel.create(data);
      return user;
    }
    throw new BadRequestException('user already exists');
  }

  async login(data: LoginInput): Promise<LoggedUserOutput> {
    const user = await this.authService.validateUser(data.email, data.password);
    if (!user) {
      throw new BadRequestException('incorrect email or password');
    }
    return this.authService.generateUserCredentials(user);
  }

  async findAll():Promise<Array<User>> {
    return await this.userModel.find({});
  }

  async findById(id: string):Promise<User> {
    const user = await this.userModel.findOne({ _id: id }).exec();
    if (user) {
      return user;
    }
  }

  async fetchSanitizedUser(email: string):Promise<SanitizedUserDTO> {
    const user = await this.findByEmail(email);
    if (user) {
      return { _id: user.id.toString(), name: user.name, email: user.email };
    }
  }

  async findByEmail(email: string):Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (user) {
      return user;
    }
  }
}
