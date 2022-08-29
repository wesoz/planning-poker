export default class Player {
  constructor(private id: string, private name: string) {}

  point = 0;

  getId(): string {
    return this.id;
  }
}
