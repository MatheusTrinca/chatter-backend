import { Injectable } from '@nestjs/common';
import { CreateMessageInput } from './dto/create-message.input';
import { Message } from './entities/message.entity';
import { ChatsRepository } from '../chats.repository';
import { Types } from 'mongoose';

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
        $or: [
          { userId },
          {
            userIds: {
              $in: [userId],
            },
          },
        ],
      },
      {
        $push: {
          messages: message,
        },
      },
    );

    return message;
  }
}
