import { loadInput } from "../utils";

type Position = { x: number; y: number };

enum Direction {
  TOP = "TOP",
  BOTTOM = "BOTTOM",
  LEFT = "LEFT",
  RIGHT = "RIGHT",
}

const toMatrix = (input: string): string[][] =>
  input.split("\n").map((line) => line.split(""));

const serializePosition = ({ x, y }: Position) => `${x}_${y}`;

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

const isObstacle = (matrix: string[][], { x, y }: Position): boolean =>
  matrix[y]?.[x] === "#";

const traceGuard = (matrix: string[][], position: Position): Set<string> => {
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

const input = loadInput();

const matrix = toMatrix(input);

const guard = findGuard(matrix);

const trace = traceGuard(matrix, guard);

console.log(trace.size);
