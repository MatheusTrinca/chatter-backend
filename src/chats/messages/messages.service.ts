import { Inject, Injectable } from '@nestjs/common';
import { CreateMessageInput } from './dto/create-message.input';
import { Message } from './entities/message.entity';
import { ChatsRepository } from '../chats.repository';
import { Types } from 'mongoose';
import { GetMessagesArgs } from './dto/get-messages.args';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from 'src/common/constants/injection-tokens';
import { MESSAGE_CREATED } from './constants/pubsub-triggers';
import { MessageCreatedArgs } from './dto/message-created.args';
import { MessageDocument } from './entities/message.document';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MessagesService {
  constructor(
    private readonly chatRepository: ChatsRepository,
    private readonly chatsRepository: ChatsRepository,
    private readonly usersService: UsersService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  async createMessage(
    { chatId, content }: CreateMessageInput,
    userId: string,
  ): Promise<Message> {
    const messageDocument: MessageDocument = {
      content,
      createdAt: new Date(),
      userId: new Types.ObjectId(userId),
      _id: new Types.ObjectId(),
    };

    await this.chatRepository.findOneAndUpdate(
      {
        _id: chatId,
      },
      {
        $push: {
          messages: messageDocument,
        },
      },
    );

    const message: Message = {
      ...messageDocument,
      user: await this.usersService.findOne(userId),
      chatId,
    };

    await this.pubSub.publish(MESSAGE_CREATED, { messageCreated: message });
    return message;
  }

  async getMessages({ chatId }: GetMessagesArgs): Promise<Message[]> {
    return this.chatsRepository.model.aggregate([
      { $match: { _id: new Types.ObjectId(chatId) } },
      { $unwind: '$messages' },
      { $replaceRoot: { newRoot: '$messages' } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      { $unset: 'userId' },
      { $set: { chatId } },
    ]);
  }

  async messageCreated({
    chatId,
  }: MessageCreatedArgs): Promise<AsyncIterator<Message>> {
    await this.chatRepository.findOne({
      _id: chatId,
    });
    return this.pubSub.asyncIterableIterator(MESSAGE_CREATED);
  }
}
