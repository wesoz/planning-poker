import { Injectable } from '@nestjs/common';
import { GameStateDTO } from './dto/GameStateDTO';
import Game from './game/Game';
import Player from './game/Player';

@Injectable()
export class AppService {
  game: Game;

  getHello(): string {
    return 'Hello World!';
  }

  getGameState(): GameStateDTO {
    if (!this.game) {
      return null;
    }
    return this.game.getGameState();
  }

  postPoint(gameId: string, playerId: string, pointValue: number): boolean {
    if (gameId !== this.game.getId()) {
      return false;
    }

    if (!this.game.findPlayer(playerId)) {
      return false;
    }

    this.game.findPlayer(playerId).point = pointValue;

    return true;
  }

  joinGame(gameId: string, playerId: string, playerName: string): boolean {
    if (gameId !== this.game.getId()) {
      return false;
    }

    if (this.game.findPlayer(playerId)) {
      return false;
    }

    this.game.addPlayer(new Player(playerId, playerName));

    return true;
  }

  leaveGame(playerId: string): boolean {
    if (!this.game) {
      return false;
    }

    return this.game.removePlayer(playerId);
  }

  createGame(gameId: string, creatorId: string, creatorName: string): boolean {
    const players = new Array<Player>();
    players.push(new Player(creatorId, creatorName));
    this.game = new Game(gameId, players);

    return true;
  }

  showCards(): boolean {
    if (!this.game) {
      return false;
    }

    this.game.setShowCards(true);

    return true;
  }

  clearPoints(): boolean {
    if (!this.game) {
      return false;
    }

    this.game.getPlayers().forEach((player: Player) => (player.point = 0));
    this.game.setShowCards(false);

    return true;
  }
}
