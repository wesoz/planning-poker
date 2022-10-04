import Game from '../game/Game';

export class GameRepository {
  games = new Array<Game>();

  findAll(): Array<Game> {
    return this.games;
  }

  find(gameId: string): Game {
    return this.games.find((g) => g.getId() === gameId);
  }

  delete(gameId: string): boolean {
    const index = this.games.findIndex((p) => p.getId() === gameId);
    if (index === -1) {
      return false;
    } else {
      this.games.splice(index, 1);
      return true;
    }
  }

  deleteAll(): boolean {
    this.games = new Array<Game>();
    return true;
  }

  create(game: Game): boolean {
    if (!game.getId()) {
      return false;
    }
    if (this.find(game.getId())) {
      return false;
    }

    this.games.push(game);

    return true;
  }
}
