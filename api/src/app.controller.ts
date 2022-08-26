import {
  Body,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { GameStateDTO } from './dto/GameStateDTO';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('game-state')
  getGameState(): GameStateDTO {
    return this.appService.getGameState();
  }

  @Post('point')
  postPoint(@Body() postPointDTO: PostPointDTO) {
    if (
      !this.appService.postPoint(
        postPointDTO.gameId,
        postPointDTO.playerId,
        postPointDTO.pointValue,
      )
    ) {
      throw new NotFoundException('Internal Error posting point');
    }
  }

  @Post('join')
  joinGame(@Body() joinDTO: CreateJoinDTO) {
    if (
      !this.appService.joinGame(
        joinDTO.gameId,
        joinDTO.playerId,
        joinDTO.playerName,
      )
    ) {
      throw new NotFoundException('Internal Error joining game');
    }
  }

  @Post('leave')
  leaveGame(@Body() data: { playerId: string }) {
    if (!this.appService.leaveGame(data.playerId)) {
      throw new NotFoundException('Internal Error leaving game');
    }
  }

  @Post('create')
  createGame(@Body() createDTO: CreateJoinDTO) {
    if (
      !this.appService.createGame(
        createDTO.gameId,
        createDTO.playerId,
        createDTO.playerName,
      )
    ) {
      throw new ConflictException('Internal Error creating game');
    }
  }

  @Post('show')
  showCards() {
    if (!this.appService.showCards()) {
      throw new NotFoundException('Internal Error leaving game');
    }
  }

  @Post('clear')
  clearPoints() {
    if (!this.appService.clearPoints()) {
      throw new ConflictException('Internal Error creating game');
    }
  }
}
