export default class Player {
    constructor(
        private id: string,
        private name: string) {

    }
    
    point: number;

    getId(): string {
        return this.id;
    }
}