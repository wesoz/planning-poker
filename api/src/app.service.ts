import { Injectable } from '@nestjs/common';
import { GameStateDTO } from './dto/GameStateDTO';
import Game from './game/Game';
import Player from './game/Player';
import { GameRepository } from './repository/GameRepository';

@Injectable()
export class AppService {
  gameRepository = new GameRepository();

  getAllGames(): Array<Game> {
    return this.gameRepository.findAll();
  }

  getGameState(gameId: string): GameStateDTO {
    const game = this.gameRepository.find(gameId);
    if (!game) {
      return null;
    }

    return game.getGameState();
  }

  postPoint(gameId: string, playerId: string, pointValue: number): boolean {
    const game = this.gameRepository.find(gameId);
    if (!game) {
      return false;
    }

    if (!game.findPlayer(playerId)) {
      return false;
    }

    game.findPlayer(playerId).point = pointValue;

    return true;
  }

  joinGame(gameId: string, playerId: string, playerName: string): boolean {
    const game = this.gameRepository.find(gameId);
    if (!game) {
      return false;
    }

    if (game.findPlayer(playerId)) {
      return false;
    }

    game.addPlayer(new Player(playerId, playerName));

    return true;
  }

  leaveGame(gameId: string, playerId: string): boolean {
    const game = this.gameRepository.find(gameId);
    if (!game) {
      return false;
    }

    if (!game.removePlayer(playerId)) {
      return false;
    }

    if (game.getPlayers().length === 0) {
      return this.gameRepository.delete(gameId);
    }

    return true;
  }

  createGame(gameId: string, creatorId: string, creatorName: string): boolean {
    const players = new Array<Player>();
    players.push(new Player(creatorId, creatorName));
    this.gameRepository.create(new Game(gameId, players));

    return true;
  }

  showCards(gameId: string): boolean {
    const game = this.gameRepository.find(gameId);
    if (!game) {
      return false;
    }

    game.setShowCards(true);

    return true;
  }

  clearPoints(gameId: string): boolean {
    const game = this.gameRepository.find(gameId);
    if (!game) {
      return false;
    }

    game.getPlayers().forEach((player: Player) => (player.point = 0));
    game.setShowCards(false);

    return true;
  }
}
