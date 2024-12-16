import { ArrayOf, loadInput, toInt } from "../utils";
import fs from "node:fs";

type Robot = { x: number; y: number; vx: number; vy: number };

type Dimensions = [width: number, height: number];

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
  ArrayOf(seconds).reduce((prev) => {
    const next = prev.map(({ x, y, vx, vy }) => ({
      x: wrap(x + vx, w),
      y: wrap(y + vy, h),
      vx,
      vy,
    }));

    return next;
  }, robots);

const renderRobots = ([w, h]: Dimensions, robots: Robot[]): string => {
  let render = "";

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const count = robots.filter((r) => r.x === x && r.y === y).length;

      render += count ? "🟢" : "⚫";
    }
    render += "\n";
  }

  return render;
};

const renderToFile = (render: string, iteration: number, fileId: string) => {
  const fileName = `output-${fileId}-${iteration}.txt`;
  const signedRender = `${iteration}\n${render}\n`;
  fs.appendFileSync(fileName, signedRender, { encoding: "utf-8" });
};

const findChristmasTreeIteration = (
  robots: Robot[],
  dimensions: Dimensions
): [number, string] => {
  let robotsInTheFuture = [...robots];
  let iteration = 1;

  while (true) {
    robotsInTheFuture = simulateRobots(robotsInTheFuture, dimensions, 1);

    const render = renderRobots(dimensions, robotsInTheFuture);

    if (render.includes("🟢".repeat(10))) {
      return [iteration, render];
    }

    iteration++;
  }
};

const input = loadInput();

const robots = toRobots(input);

const dimensions = getDimensions(robots);

const [xMasTreeIteration, render] = findChristmasTreeIteration(
  robots,
  dimensions
);

console.log(render);
console.log(xMasTreeIteration);

renderToFile(render, xMasTreeIteration, Date.now().toString());
