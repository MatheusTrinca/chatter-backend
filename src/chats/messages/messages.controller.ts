import { Controller, Get, Query } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('count')
  async countMessages(
    @Query('chatId') chatId: string,
  ): Promise<{ messages: number }> {
    return this.messagesService.countMessages(chatId);
  }
}
