/* eslint-disable prettier/prettier */
import Player from 'src/game/Player';

export interface GameStateDTO {
  players: Array<Player>;
  showCards: boolean;
}
