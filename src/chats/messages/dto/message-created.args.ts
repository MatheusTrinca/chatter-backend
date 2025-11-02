import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@ArgsType()
export class MessageCreatedArgs {
  @Field(() => String)
  @IsNotEmpty()
  chatId: string;
}
