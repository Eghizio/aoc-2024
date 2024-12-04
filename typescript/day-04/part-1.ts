import { loadInput } from "../utils";

const toMatrix = (input: string): string[][] =>
  input.split("\n").map((line) => line.split(""));

const top = (matrix: string[][], x: number, y: number) => [
  matrix[y]?.[x],
  matrix[y - 1]?.[x],
  matrix[y - 2]?.[x],
  matrix[y - 3]?.[x],
];

const bottom = (matrix: string[][], x: number, y: number) => [
  matrix[y]?.[x],
  matrix[y + 1]?.[x],
  matrix[y + 2]?.[x],
  matrix[y + 3]?.[x],
];

const left = (matrix: string[][], x: number, y: number) => [
  matrix[y]?.[x],
  matrix[y]?.[x - 1],
  matrix[y]?.[x - 2],
  matrix[y]?.[x - 3],
];

const right = (matrix: string[][], x: number, y: number) => [
  matrix[y]?.[x],
  matrix[y]?.[x + 1],
  matrix[y]?.[x + 2],
  matrix[y]?.[x + 3],
];

const topLeft = (matrix: string[][], x: number, y: number) => [
  matrix[y]?.[x],
  matrix[y - 1]?.[x - 1],
  matrix[y - 2]?.[x - 2],
  matrix[y - 3]?.[x - 3],
];

const topRight = (matrix: string[][], x: number, y: number) => [
  matrix[y]?.[x],
  matrix[y - 1]?.[x + 1],
  matrix[y - 2]?.[x + 2],
  matrix[y - 3]?.[x + 3],
];

const bottomLeft = (matrix: string[][], x: number, y: number) => [
  matrix[y]?.[x],
  matrix[y + 1]?.[x - 1],
  matrix[y + 2]?.[x - 2],
  matrix[y + 3]?.[x - 3],
];

const bottomRight = (matrix: string[][], x: number, y: number) => [
  matrix[y]?.[x],
  matrix[y + 1]?.[x + 1],
  matrix[y + 2]?.[x + 2],
  matrix[y + 3]?.[x + 3],
];

const searchAround = (matrix: string[][], x: number, y: number) => [
  top(matrix, x, y),
  bottom(matrix, x, y),
  left(matrix, x, y),
  right(matrix, x, y),
  topLeft(matrix, x, y),
  topRight(matrix, x, y),
  bottomLeft(matrix, x, y),
  bottomRight(matrix, x, y),
];

const searchFromLetter = (matrix: string[][]): number => {
  let count = 0;

  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      const around = searchAround(matrix, x, y);

      const words = around.map((line) => line.filter(Boolean).join(""));

      const xmas = words.filter((word) => word === "XMAS");

      count += xmas.length;
    }
  }

  return count;
};

const input = loadInput();

const matrix = toMatrix(input);

console.log(searchFromLetter(matrix));
