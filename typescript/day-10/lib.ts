import { toInt } from "../utils";

export type Matrix<T = string> = T[][];

export class Position {
  constructor(public x: number, public y: number) {}

  static serialize({ x, y }: Position): string {
    return `${x}_${y}`;
  }

  static deserialize(serialized: string): Position {
    const [x, y] = serialized.split("_").map(toInt);
    return new Position(x, y);
  }

  toString(): string {
    return Position.serialize(this);
  }

  top(): Position {
    return new Position(this.x, this.y - 1);
  }

  bottom(): Position {
    return new Position(this.x, this.y + 1);
  }

  left(): Position {
    return new Position(this.x - 1, this.y);
  }

  right(): Position {
    return new Position(this.x + 1, this.y);
  }
}

export class Spot {
  /* Could have internal Readonly<Matrix<Spot>> */
  constructor(public position: Position, public height: number) {}

  static serialize({ position, height }: Spot): string {
    return `${position}_${height}`;
  }

  static deserialize(serialized: string): Spot {
    const [x, y, h] = serialized.split("_").map(toInt);
    return new Spot(new Position(x, y), h);
  }

  static canAdvance(spot: Spot, target: Spot): boolean {
    return target.height - spot.height === 1;
  }

  toString(): string {
    return Spot.serialize(this);
  }

  canAdvance(target: Spot): boolean {
    return Spot.canAdvance(this, target);
  }

  top(matrix: Matrix<Spot>): Spot {
    const t = this.position.top();
    const height = matrix[t.y]?.[t.x]?.height;
    return new Spot(t, height);
  }

  bottom(matrix: Matrix<Spot>): Spot {
    const b = this.position.bottom();
    const height = matrix[b.y]?.[b.x]?.height;
    return new Spot(b, height);
  }

  left(matrix: Matrix<Spot>): Spot {
    const l = this.position.left();
    const height = matrix[l.y]?.[l.x]?.height;
    return new Spot(l, height);
  }

  right(matrix: Matrix<Spot>): Spot {
    const r = this.position.right();
    const height = matrix[r.y]?.[r.x]?.height;
    return new Spot(r, height);
  }

  around(matrix: Matrix<Spot>): Spot[] {
    return [
      this.top(matrix),
      this.bottom(matrix),
      this.left(matrix),
      this.right(matrix),
    ].filter((target) => Spot.canAdvance(this, target));
  }
}

interface Serializable {
  toString(): string;
}

export class Trail<T extends Serializable> {
  public path: Set<T>;

  constructor(initialPath: T[] = []) {
    this.path = new Set(initialPath);
  }

  get size() {
    return this.path.size;
  }

  toString(): string {
    return [...this.path].join(" -> ");
  }

  add(target: T): void {
    if (!this.includes(target)) this.path.add(target);
  }

  delete(target: T): void {
    const filtered = Array.from(this.path).filter(
      (t) => t.toString() !== target.toString()
    );

    this.path = new Set(filtered);
  }

  includes(target: T): boolean {
    return this.find(target) !== undefined;
  }

  private find(target: T): T | undefined {
    return Array.from(this.path.values()).find(
      (t) => t.toString() === target.toString()
    );
  }
}
