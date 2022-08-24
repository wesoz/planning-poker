import { Injectable } from '@nestjs/common';
import Game from './game/Game';
import Player from './game/Player';

@Injectable()
export class AppService {
  game: Game;

  getHello(): string {
    return 'Hello World!';
  }

  getPlayers(): Array<Player> {
    return this.game.getPlayers();
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

  createGame(gameId: string, creatorId: string, creatorName: string): boolean {
    const players = new Array<Player>();
    players.push(new Player(creatorId, creatorName));
    this.game = new Game(
      gameId,
      players
    );

    return true;
  }

  clearPoints(): boolean {
    if (!this.game) {
      return false;
    }

    this.game.getPlayers().forEach((player: Player) => player.point = 0);

    return true;
  }
}
