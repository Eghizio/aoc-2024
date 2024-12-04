import { loadInput } from "../utils";

const toMatrix = (input: string): string[][] =>
  input.split("\n").map((line) => line.split(""));

const topLeftToBottomRight = (matrix: string[][], x: number, y: number) => [
  matrix[y - 1]?.[x - 1],
  matrix[y]?.[x],
  matrix[y + 1]?.[x + 1],
];

const topRighttoBottomLeft = (matrix: string[][], x: number, y: number) => [
  matrix[y - 1]?.[x + 1],
  matrix[y]?.[x],
  matrix[y + 1]?.[x - 1],
];

const searchAround = (matrix: string[][], x: number, y: number) => [
  topLeftToBottomRight(matrix, x, y),
  topLeftToBottomRight(matrix, x, y).toReversed(),
  topRighttoBottomLeft(matrix, x, y),
  topRighttoBottomLeft(matrix, x, y).toReversed(),
];

const searchFromLetter = (matrix: string[][]): number => {
  let count = 0;

  for (let y = 1; y < matrix.length - 1; y++) {
    for (let x = 1; x < matrix[y].length - 1; x++) {
      if (matrix[y][x] !== "A") continue;
      const around = searchAround(matrix, x, y);

      const words = around.map((line) => line.filter(Boolean).join(""));

      const xMas = words.filter((word) => word === "MAS");

      if (xMas.length >= 2) count++;
    }
  }

  return count;
};

const input = loadInput();

const matrix = toMatrix(input);

console.log(searchFromLetter(matrix));
