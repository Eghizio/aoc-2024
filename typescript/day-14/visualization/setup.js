const toInt = (x) => parseInt(x, 10);

const ArrayOf = (length) => Array.from({ length }, (_, i) => i);

export const toRobots = (input) =>
  input.split("\n").map((line) => {
    const [left, right] = line.split(" ").map((l) => l.slice(2));
    const [x, y] = left.split(",").map((xy) => toInt(xy));
    const [vx, vy] = right.split(",").map((xy) => toInt(xy));
    return { x, y, vx, vy };
  });

export const getDimensions = (robots) =>
  robots.reduce(
    ([x, y], robot) => [Math.max(x, robot.x), Math.max(y, robot.y)],
    [0, 0]
  );

const wrap = (xy, wh) => (xy + (wh + 1)) % (wh + 1);

export const simulateRobots = (robots, [w, h], seconds = 100) =>
  ArrayOf(seconds).reduce((prev) => {
    const next = prev.map(({ x, y, vx, vy }) => ({
      x: wrap(x + vx, w),
      y: wrap(y + vy, h),
      vx,
      vy,
    }));

    return next;
  }, robots);
