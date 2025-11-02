import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';
import { AbstractEntity } from 'src/common/database/absctract.entity';

@Schema({ versionKey: false })
@ObjectType()
export class Message extends AbstractEntity {
  @Field()
  @Prop()
  content: string;

  @Field()
  @Prop()
  createdAt: Date;

  @Field()
  @Prop()
  userId: string;

  @Field()
  @Prop()
  chatId: string;
}
