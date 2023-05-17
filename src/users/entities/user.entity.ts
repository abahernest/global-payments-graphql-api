import { ObjectType, Field } from '@nestjs/graphql';
import { Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema()
@ObjectType()
export class User {
  @Field(() => String)
  id: MongooseSchema.Types.ObjectId;
  @Prop()
  @Field(() => String, { description: 'User fullname' })
  name: string;
  @Prop()
  @Field(() => String, { description: 'User email' })
  email: string;
  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);