import { loadInput } from "../utils";

const toMatrix = (input: string): string[][] =>
  input.split("\n").map((line) => line.split(""));

const LineFor = (mapper: (value: any, i: number) => any, length: number = 4) =>
  Array.from({ length }, mapper);

const searchAround = (matrix: string[][], x: number, y: number) => [
  LineFor((_, i) => matrix[y - i]?.[x]), // top
  LineFor((_, i) => matrix[y + i]?.[x]), // bottom
  LineFor((_, i) => matrix[y]?.[x - i]), // left
  LineFor((_, i) => matrix[y]?.[x + i]), // right
  LineFor((_, i) => matrix[y - i]?.[x - i]), // topLeft
  LineFor((_, i) => matrix[y - i]?.[x + i]), // topRight
  LineFor((_, i) => matrix[y + i]?.[x - i]), // bottomLeft
  LineFor((_, i) => matrix[y + i]?.[x + i]), // bottomRight
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
