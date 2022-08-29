import {
  Body,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { GameStateDTO } from './dto/GameStateDTO';
import Game from './game/Game';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('all')
  getAllGames(): Array<Game> {
    return this.appService.getAllGames();
  }

  @Get('game-state/:gameId')
  getGameState(@Param('gameId') gameId: string): GameStateDTO {
    return this.appService.getGameState(gameId);
  }

  @Get('validate-player/:gameId/:playerId')
  validatePlayer(
    @Param('gameId') gameId: string,
    @Param('playerId') playerId: string,
  ): boolean {
    return this.appService.validatePlayer(gameId, playerId);
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
  leaveGame(@Body() data: { gameId: string; playerId: string }) {
    if (!this.appService.leaveGame(data.gameId, data.playerId)) {
      throw new NotFoundException('Internal Error leaving game');
    }
  }

  @Post('create')
  createGame(@Body() createDTO: CreateJoinDTO): CreateJoinDTO {
    if (
      !this.appService.createGame(
        createDTO.gameId,
        createDTO.playerId,
        createDTO.playerName,
      )
    ) {
      throw new ConflictException('Internal Error creating game');
    }

    return createDTO;
  }

  @Post('show')
  showCards(@Body() data: { gameId: string }) {
    if (!this.appService.showCards(data.gameId)) {
      throw new NotFoundException('Internal Error changing show attribute');
    }
  }

  @Post('clear')
  clearPoints(@Body() data: { gameId: string }) {
    if (!this.appService.clearPoints(data.gameId)) {
      throw new ConflictException('Internal Error creating game');
    }
  }
}
