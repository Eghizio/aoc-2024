import { loadInput, sum, toInt } from "../utils";

const toMatrix = (input: string): string[][] =>
  input.split("\n").map((line) => line.split(""));

type Position = { x: number; y: number };

const serializePosition = ({ x, y }: Position) => `${x}_${y}`;

const deserializePosition = (position: string): Position => {
  const [x, y] = position.split("_").map(toInt);
  return { x, y };
};

const findAntennas = (matrix: string[][]) => {
  const antennas = new Map<string, Set<Position>>();

  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      const char = matrix[y][x];
      if (char === ".") continue;

      //   console.log(char, { x, y });

      const specificAntennas = antennas.get(char) ?? new Set();
      const position = { x, y };
      //   const position = serializePosition({ x, y });
      specificAntennas.add(position);

      antennas.set(char, specificAntennas);
    }
  }

  return antennas;
};

const isWithinBounds = (matrix: string[][], position: Position): boolean =>
  position.x >= 0 &&
  position.x < matrix[0].length &&
  position.y >= 0 &&
  position.y < matrix.length;

// const distance = (a: Position, b: Position): number =>
//   Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

const diff = (x: number, y: number) => x - y;

const nextAntinode = (a: Position, b: Position): Position => ({
  x: a.x + diff(a.x, b.x),
  y: a.y + diff(a.y, b.y),
});

const findAntinodes = (a: Position, b: Position): [Position, Position] => [
  nextAntinode(a, b),
  nextAntinode(b, a),
];

const findAntinodesInLine = (
  a: Position,
  b: Position,
  matrix: string[][]
): Position[] => {
  const line = [b, a];

  let current = nextAntinode(a, b);

  while (isWithinBounds(matrix, current)) {
    // console.log(current);

    const [prev] = line;
    line.unshift(current);
    current = nextAntinode(prev, current);
  }

  return line;
};

const findResonatingAntinodes = (
  a: Position,
  b: Position,
  matrix: string[][]
): Position[] => {
  const left = findAntinodesInLine(a, b, matrix);
  const right = findAntinodesInLine(b, a, matrix);

  return [...left, ...right];
  //   return findAntinodes(a, b);
};

const getAllAntinodesForAntennaType = (
  antennas: Position[],
  matrix: string[][]
): Position[] => {
  const antinodes = antennas.flatMap((x, i) => {
    const ys = antennas.filter((_, j) => i !== j);
    return ys.flatMap((y) => findResonatingAntinodes(x, y, matrix));
  });

  return antinodes;
};

const getUniqueAntinodes = (
  antennas: Map<string, Set<Position>>,
  matrix: string[][]
): Set<string> => {
  const antennaTypes = Array.from(antennas.keys());
  const antinodes = antennaTypes.flatMap((type) =>
    getAllAntinodesForAntennaType(
      Array.from(antennas.get(type) ?? new Set()),
      matrix
    )
  );

  // console.log(antinodes);

  const uniqueAntinodes = new Set(
    antinodes.filter((a) => isWithinBounds(matrix, a)).map(serializePosition)
  );

  return uniqueAntinodes;
};

const testInput = `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`;
const input = loadInput();
// const input = testInput;

const matrix = toMatrix(input);

const antennas = findAntennas(matrix);

console.log(getUniqueAntinodes(antennas, matrix).size);

const getAllAntinodesCount = (
  antennas: Map<string, Set<Position>>,
  matrix: string[][]
): number => {
  const uniques = getUniqueAntinodes(antennas, matrix);
  const baseAntennas = Array.from(antennas.values()).flatMap((set) => [...set]);
  console.log(baseAntennas);

  return uniques.size + baseAntennas.length;
};

// off by 1.
console.log(getAllAntinodesCount(antennas, matrix)); // 868 too low.

// console.log(antennas);
