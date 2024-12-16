import { loadInput, toInt } from "../utils";

type Position = { x: number; y: number };

enum Direction {
  TOP = "TOP",
  BOTTOM = "BOTTOM",
  LEFT = "LEFT",
  RIGHT = "RIGHT",
}

type Move = { position: Position; direction: Direction };

const toMatrix = (input: string): string[][] =>
  input.split("\n").map((line) => line.split(""));

const serializePosition = ({ x, y }: Position): string => `${x}_${y}`;

const deserializePosition = (position: string): Position => {
  const [x, y] = position.split("_").map(toInt);
  return { x, y };
};

const findGuard = (matrix: string[][], guard: string = "^"): Position => {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (matrix[y][x] === guard) return { x, y };
    }
  }
  throw new Error("No guard found");
};

const getNextDirection = (direction: Direction): Direction =>
  ({
    [Direction.TOP]: Direction.RIGHT,
    [Direction.RIGHT]: Direction.BOTTOM,
    [Direction.BOTTOM]: Direction.LEFT,
    [Direction.LEFT]: Direction.TOP,
  }[direction]);

const getNextPosition = (
  { x, y }: Position,
  direction: Direction = Direction.TOP
): Position => {
  switch (direction) {
    case Direction.TOP:
      return { x, y: y - 1 };
    case Direction.RIGHT:
      return { x: x + 1, y };
    case Direction.BOTTOM:
      return { x, y: y + 1 };
    case Direction.LEFT:
      return { x: x - 1, y };
  }
};

const isWithinBoundaries = (matrix: string[][], { x, y }: Position): boolean =>
  matrix[y]?.[x] !== undefined;

const isObstacle = (matrix: string[][], { x, y }: Position) =>
  matrix[y]?.[x] === "#";

const copyMatrix = (matrix: string[][]): string[][] =>
  matrix.map((row) => row.slice());

const serializeMove = ({ position: { x, y }, direction }: Move): string =>
  `${x}_${y}_${direction}`;

const getTrace = (matrix: string[][], position: Position): Set<string> => {
  const traces = new Set<string>([serializePosition(position)]);

  let direction = Direction.TOP;

  while (isWithinBoundaries(matrix, position)) {
    const nextPosition = getNextPosition(position, direction);

    if (isObstacle(matrix, nextPosition)) {
      direction = getNextDirection(direction);
      continue;
    }

    position = nextPosition;

    if (isWithinBoundaries(matrix, position)) {
      traces.add(serializePosition(position));
    }
  }

  return traces;
};

const generateObstacleMatrixes = (
  matrix: string[][],
  positions: Position[]
): string[][][] => {
  return positions.map(({ x, y }) => {
    const obstacledMatrix = copyMatrix(matrix);
    obstacledMatrix[y][x] = "#";
    return obstacledMatrix;
  });
};

const traceGuard = (matrix: string[][], position: Position): boolean => {
  let direction = Direction.TOP;

  const traces = new Set<string>([serializeMove({ position, direction })]);

  while (isWithinBoundaries(matrix, position)) {
    const nextPosition = getNextPosition(position, direction);

    if (isObstacle(matrix, nextPosition)) {
      direction = getNextDirection(direction);
      continue;
    }

    position = nextPosition;

    const serializedMove = serializeMove({ position, direction });

    if (traces.has(serializedMove)) {
      return true;
    }

    if (isWithinBoundaries(matrix, position)) {
      traces.add(serializedMove);
    }
  }

  return false;
};

const input = loadInput();

const matrix = toMatrix(input);

const guard = findGuard(matrix);

const obstaclePositions = Array.from(getTrace(matrix, guard))
  .slice(1)
  .map(deserializePosition);

const obstacledTrace = generateObstacleMatrixes(matrix, obstaclePositions);

const obstaclesCount = obstacledTrace
  .map((obstacledMatrix, i) => traceGuard(obstacledMatrix, guard))
  .filter(Boolean).length;

console.log(obstaclesCount);
