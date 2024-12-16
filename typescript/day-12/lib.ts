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

type Direction = "top" | "bottom" | "left" | "right";

export class Plot {
  /* Could have internal Readonly<Matrix<Plot>> */
  constructor(public x: number, public y: number, public plant: string) {}

  static serialize({ x, y, plant }: Plot): string {
    return `${x}_${y}_${plant}`;
  }

  static deserialize(serialized: string): Plot {
    const [x, y, p] = serialized.split("_");
    return new Plot(toInt(x), toInt(y), p);
  }

  static isSamePlant(plot: Plot, target: Plot): boolean {
    return plot.plant === target.plant;
  }

  toString(): string {
    return Plot.serialize(this);
  }

  isSamePlant(target: Plot): boolean {
    return Plot.isSamePlant(this, target);
  }

  private getTranslated(matrix: Matrix<Plot>, direction: Direction): Plot {
    const position = new Position(this.x, this.y);
    const { x, y } = position[direction]();

    return matrix[y]?.[x];
  }

  top(matrix: Matrix<Plot>): Plot {
    return this.getTranslated(matrix, "top");
  }

  bottom(matrix: Matrix<Plot>): Plot {
    return this.getTranslated(matrix, "bottom");
  }

  left(matrix: Matrix<Plot>): Plot {
    return this.getTranslated(matrix, "left");
  }

  right(matrix: Matrix<Plot>): Plot {
    return this.getTranslated(matrix, "right");
  }

  around(matrix: Matrix<Plot>): Plot[] {
    return [
      this.top(matrix),
      this.bottom(matrix),
      this.left(matrix),
      this.right(matrix),
    ]
      .filter(Boolean)
      .filter((target) => Plot.isSamePlant(this, target));
  }

  perimeter(matrix: Matrix<Plot>): Plot[] {
    return [
      this.top(matrix),
      this.bottom(matrix),
      this.left(matrix),
      this.right(matrix),
    ].filter(
      (target) => target?.plant === undefined || !Plot.isSamePlant(this, target)
    );
  }
}
