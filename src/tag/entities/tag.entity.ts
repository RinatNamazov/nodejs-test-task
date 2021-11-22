export class Tag {
  public id: number;

  constructor(
    public creator: string,
    public name: string,
    public sortOrder: number = 0,
  ) {}
}
