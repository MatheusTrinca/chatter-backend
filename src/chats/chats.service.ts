import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateChatInput } from './dto/create-chat.input';
// import { UpdateChatInput } from './dto/update-chat.input';
import { ChatsRepository } from './chats.repository';
import { Chat } from './entities/chat.entity';
import { PipelineStage, Types } from 'mongoose';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from 'src/common/constants/injection-tokens';
import { CHAT_CREATED } from './messages/constants/pubsub-triggers';
import { PaginationArgs } from 'src/common/dto/pagination-args';

@Injectable()
export class ChatsService {
  constructor(
    private readonly chatsRepository: ChatsRepository,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  async create(
    createChatInput: CreateChatInput,
    userId: string,
  ): Promise<Chat> {
    const chat = await this.chatsRepository.create({
      ...createChatInput,
      userId,
      messages: [],
    });

    // await this.pubSub.publish(CHAT_CREATED, { chatCreated: chat });

    return chat;
  }

  async findMany(
    prePipelineStages: PipelineStage[] = [],
    paginationArgs?: PaginationArgs,
  ): Promise<Chat[]> {
    const chats = await this.chatsRepository.model.aggregate([
      ...prePipelineStages,
      {
        $set: {
          latestMessage: {
            $cond: [
              '$messages',
              { $arrayElemAt: ['$messages', -1] },
              {
                createdAt: new Date(),
              },
            ],
          },
        },
      },
      { $sort: { 'latestMessage.createdAt': -1 } },
      { $skip: paginationArgs?.skip || 0 },
      { $limit: paginationArgs?.limit || 1 },
      { $unset: 'messages' },
      {
        $lookup: {
          from: 'users',
          localField: 'latestMessage.userId',
          foreignField: '_id',
          as: 'latestMessage.user',
        },
      },
    ]);
    chats.forEach((chat) => {
      if (!chat.latestMessage?._id) {
        delete chat.latestMessage;
        return;
      }
      chat.latestMessage.user = chat.latestMessage.user[0];
      delete chat.latestMessage.userId;
      chat.latestMessage.chatId = chat._id;
    });
    return chats;
  }

  async findOne(_id: string) {
    const chats = await this.findMany([
      { $match: { _id: new Types.ObjectId(_id) } },
    ]);

    if (!chats[0]) {
      throw new NotFoundException(`No chat was found with ID ${_id}`);
    }

    return chats[0];
  }

  chatCreated(): AsyncIterator<Chat> {
    return this.pubSub.asyncIterableIterator(CHAT_CREATED);
  }

  countChats(): Promise<number> {
    return this.chatsRepository.model.countDocuments();
  }

  // update(id: number, updateChatInput: UpdateChatInput) {
  //   return `This action updates a #${id} chat`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} chat`;
  // }
}
