import { readFileSync } from "fs";

export const loadInput = (file: string = "input"): string =>
  readFileSync(file, { encoding: "utf-8" });

export const sum = (arr: number[]) => arr.reduce((acc, el) => acc + el, 0);

export const toInt = (x: string) => parseInt(x, 10);

export const ArrayOf = (length: number) => Array.from({ length }, (_, i) => i);

export type Matrix<T = string> = T[][];

type Mapper<Source, Target> = (
  point: [s: Source, x: number, y: number]
) => Target;

export const toMatrix = <T = string>(
  input: string,
  mapper: Mapper<string, T> = ([s]) => s as T
): Matrix<T> =>
  input
    .split("\n")
    .map((line, y) => line.split("").map((s, x) => mapper([s, x, y])));

export const renderMatrix = (
  matrix: Matrix<string>,
  mapping: Record<string, string> = {}
): void => {
  for (let y = 0; y < matrix.length; y++) {
    let row = "";
    for (let x = 0; x < matrix[y].length; x++) {
      const field = matrix[y][x];
      const char = mapping[field] ?? field;
      row += char;
    }
    console.log(row);
  }
};

class SuperSet<T> extends Set<T> {
  constructor(iterable?: Iterable<T>) {
    super(iterable);
  }

  toArray() {
    const array = new SuperArray();
    array.push(...this);
    return array;
  }
}

class SuperArray<T> extends Array<T> {
  constructor(length: number = 0) {
    super(length);
  }

  toSet() {
    return new SuperSet(this);
  }
}
