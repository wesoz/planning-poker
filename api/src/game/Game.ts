/* eslint-disable prettier/prettier */
import { GameStateDTO } from '../dto/GameStateDTO';
import Player from './Player';

export default class Game {
  private showCards: boolean;

  constructor(
    private gameId: string,
    private players: Array<Player>,
  ) {
    this.showCards = false;
  }

  setShowCards(value: boolean) {
    this.showCards = value;
  }

  getId(): string {
    return this.gameId;
  }

  findPlayer(playerId: string) {
    return this.players.find((p) => p.getId() === playerId);
  }

  addPlayer(player: Player) {
    this.players.push(player);
  }

  getPlayers(): Array<Player> {
    return this.players;
  }

  getGameState(): GameStateDTO {
    return { players: this.players, showCards: this.showCards };
  }

  removePlayer(playerId: string): boolean {
    const index = this.players.findIndex(p => { 
      console.log(p.getId(), playerId, p.getId() === playerId);
      return  p.getId() === playerId
    });
    console.log(index);
    if (index === -1) {
      return false;
    } else {
      this.players.splice(index, 1);
      return true;
    }
  }
}
