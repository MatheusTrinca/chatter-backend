import { Controller, Get, UseGuards } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get('count')
  @UseGuards(JwtAuthGuard)
  async countChats(): Promise<number> {
    const count = await this.chatsService.countChats();
    return count;
  }
}
