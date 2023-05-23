
type MarkTag = 'x' | 'o';

export class Mark {

  private constructor(private tag: MarkTag, public readonly icon: string) {
  }

  public static readonly X = new Mark('x', 'X');
  public static readonly O = new Mark('o', 'O');

  public equals(other: Value): boolean {
    if (!other) return false;
    return this.tag === other.tag;
  }

  public other() : Mark {
    return this.equals(Mark.X) ? Mark.O : Mark.X;
  }
}

export type Value = Mark | undefined;

export class ValueSet {
  private readonly values: Value[];

  private constructor(values: Value[]) {
    this.values = values.slice();
  }

  public static create(): ValueSet {
    return new ValueSet(Array<Value>(9).fill(undefined));
  }

  private set(index: number, mark: Mark): void {
    this.values[index] = mark;
  }

  public get(index: number): Value {
    return this.values[index];
  }

  public length(): number {
    return this.values.length;
  }

  public isFree(index: number): boolean {
    return this.values[index] === undefined;
  }

  public createPlay(index: number, mark: Mark): ValueSet {
    const x = new ValueSet(this.values);
    x.set(index, mark);
    return x;
  }

  public calculateWinner(): Value {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],
      [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i].map(i => this.get(i));
      if (a && a.equals(b) && a.equals(c)) return a;
    }
    return undefined;
  }

}