import { Injectable } from '@nestjs/common';
import { CreateMessageInput } from './dto/create-message.input';
import { Message } from './entities/message.entity';
import { ChatsRepository } from '../chats.repository';
import { Types } from 'mongoose';
import { GetMessagesArgs } from './dto/get-messages.args';

@Injectable()
export class MessagesService {
  constructor(private readonly chatRepository: ChatsRepository) {}

  async createMessage(
    { chatId, content }: CreateMessageInput,
    userId: string,
  ): Promise<Message> {
    const message: Message = {
      content,
      createdAt: new Date(),
      userId,
      _id: new Types.ObjectId(),
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
