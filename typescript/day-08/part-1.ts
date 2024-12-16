import { loadInput, toInt } from "../utils";

type Position = { x: number; y: number };

const toMatrix = (input: string): string[][] =>
  input.split("\n").map((line) => line.split(""));

const serializePosition = ({ x, y }: Position) => `${x}_${y}`;

const findAntennas = (matrix: string[][]) => {
  const antennas = new Map<string, Set<Position>>();

  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      const char = matrix[y][x];
      if (char === ".") continue;

      const specificAntennas = antennas.get(char) ?? new Set();
      const position = { x, y };

      specificAntennas.add(position);

      antennas.set(char, specificAntennas);
    }
  }

  return antennas;
};

const diff = (x: number, y: number) => x - y;

const findAntinodes = (a: Position, b: Position): [Position, Position] => {
  const first = { x: a.x + diff(a.x, b.x), y: a.y + diff(a.y, b.y) };
  const second = { x: b.x + diff(b.x, a.x), y: b.y + diff(b.y, a.y) };

  return [first, second];
};

const getAllAntinodesForAntennaType = (antennas: Position[]): Position[] => {
  const antinodes = antennas.flatMap((x, i) => {
    const ys = antennas.filter((_, j) => i !== j);
    return ys.flatMap((y) => findAntinodes(x, y));
  });

  return antinodes;
};

const isWithinBounds = (matrix: string[][], position: Position): boolean =>
  position.x >= 0 &&
  position.x < matrix[0].length &&
  position.y >= 0 &&
  position.y < matrix.length;

const getUniqueAntinodes = (
  antennas: Map<string, Set<Position>>
): Set<string> => {
  const antennaTypes = Array.from(antennas.keys());
  const antinodes = antennaTypes.flatMap((type) =>
    getAllAntinodesForAntennaType(Array.from(antennas.get(type) ?? new Set()))
  );

  const uniqueAntinodes = new Set(
    antinodes.filter((a) => isWithinBounds(matrix, a)).map(serializePosition)
  );

  return uniqueAntinodes;
};

const input = loadInput();

const matrix = toMatrix(input);

const antennas = findAntennas(matrix);

console.log(getUniqueAntinodes(antennas).size);
