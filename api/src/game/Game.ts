import Player from "./Player";

export default class Game {
    constructor(
        // private creator: Player,
        private gameId: string,
        private players: Array<Player>) {
        
    }
    
    getId(): string {
        return this.gameId;
    }

    findPlayer(playerId: string) {
        return this.players.find(p => p.getId() === playerId);
    }

    addPlayer(player: Player) {
        this.players.push(player);
    }

    getPlayers(): Array<Player> {
        return this.players;
    }
}