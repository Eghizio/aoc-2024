import { ArrayOf, loadInput, toInt } from "../utils";

type Robot = { x: number; y: number; vx: number; vy: number };

type Dimensions = [width: number, height: number];

type Quadrants = [Robot[], Robot[], Robot[], Robot[]];

const toRobots = (input: string): Robot[] =>
  input.split("\n").map((line) => {
    const [left, right] = line.split(" ").map((l) => l.slice(2));
    const [x, y] = left.split(",").map((xy) => toInt(xy));
    const [vx, vy] = right.split(",").map((xy) => toInt(xy));
    return { x, y, vx, vy };
  });

const getDimensions = (robots: Robot[]): [number, number] =>
  robots.reduce<[number, number]>(
    ([x, y], robot) => [Math.max(x, robot.x), Math.max(y, robot.y)],
    [0, 0]
  );

const wrap = (xy: number, wh: number): number => (xy + (wh + 1)) % (wh + 1);

const simulateRobots = (
  robots: Robot[],
  [w, h]: Dimensions,
  seconds: number = 100
): Robot[] =>
  ArrayOf(seconds).reduce(
    (prev) =>
      prev.map(({ x, y, vx, vy }) => ({
        x: wrap(x + vx, w),
        y: wrap(y + vy, h),
        vx,
        vy,
      })),
    robots
  );

const toQuadrants = (robots: Robot[], dimensions: Dimensions): Quadrants => {
  const [w, h] = dimensions.map((d) => d / 2);

  const q1 = robots.filter(({ x, y }) => x < w && y < h);
  const q2 = robots.filter(({ x, y }) => x > w && y < h);
  const q3 = robots.filter(({ x, y }) => x < w && y > h);
  const q4 = robots.filter(({ x, y }) => x > w && y > h);

  const quadrants: Quadrants = [q1, q2, q3, q4];

  return quadrants;
};

const multiply = (numbers: number[]): number =>
  numbers.length === 0 ? 0 : numbers.reduce((acc, n) => acc * n, 1);

const calculateSafetyScore = (
  robots: Robot[],
  dimensions: Dimensions
): number => multiply(toQuadrants(robots, dimensions).map((q) => q.length));

const input = loadInput();

const robots = toRobots(input);

const dimensions = getDimensions(robots);

const robotsInTheFuture = simulateRobots(robots, dimensions, 100);

const safetyScore = calculateSafetyScore(robotsInTheFuture, dimensions);

console.log(safetyScore);
