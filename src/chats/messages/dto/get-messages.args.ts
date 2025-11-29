import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { PaginationArgs } from 'src/common/dto/pagination-args';

@ArgsType()
export class GetMessagesArgs extends PaginationArgs {
  @Field(() => String)
  @IsNotEmpty()
  chatId: string;
}
