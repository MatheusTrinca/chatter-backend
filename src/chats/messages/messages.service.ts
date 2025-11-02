import { Inject, Injectable } from '@nestjs/common';
import { CreateMessageInput } from './dto/create-message.input';
import { Message } from './entities/message.entity';
import { ChatsRepository } from '../chats.repository';
import { Types } from 'mongoose';
import { GetMessagesArgs } from './dto/get-messages.args';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from 'src/common/constants/injection-tokens';
import { MESSAGE_CREATED } from './constants/pubsub-triggers';

@Injectable()
export class MessagesService {
  constructor(
    private readonly chatRepository: ChatsRepository,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  async createMessage(
    { chatId, content }: CreateMessageInput,
    userId: string,
  ): Promise<Message> {
    const message: Message = {
      content,
      createdAt: new Date(),
      userId,
      _id: new Types.ObjectId(),
      chatId,
    };

    await this.chatRepository.findOneAndUpdate(
      {
        _id: chatId,
        ...this.userChatFilter(userId),
      },
      {
        $push: {
          messages: message,
        },
      },
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.pubSub.publish(MESSAGE_CREATED, { messageCreated: message });
    return message;
  }

  async getMessages(
    { chatId }: GetMessagesArgs,
    userId: string,
  ): Promise<Message[]> {
    return (
      await this.chatRepository.findOne({
        _id: chatId,
        ...this.userChatFilter(userId),
      })
    ).messages;
  }

  private userChatFilter(userId: string) {
    return {
      $or: [
        { userId },
        {
          userIds: {
            $in: [userId],
          },
        },
      ],
    };
  }
}
