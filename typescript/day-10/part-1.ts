import { loadInput, sum, toInt } from "../utils";
import { Matrix, Position, Spot } from "./lib";

const toMatrix = (input: string): Matrix<number> =>
  input.split("\n").map((line) => line.split("").map(toInt));

const toSpotMatrix = (matrix: Matrix<number>): Matrix<Spot> =>
  matrix.map((row, y) =>
    row.map((height, x) => new Spot(new Position(x, y), height))
  );

const findTrailheads = (matrix: Matrix<Spot>): Spot[] =>
  matrix.flat().filter((spot) => spot.height === 0);

const findSingleTrail = (
  matrix: Matrix<Spot>,
  trailhead: Spot
): Map<string, Spot> => {
  const visited = new Map<string, Spot>([[trailhead.toString(), trailhead]]);

  let toVisit = trailhead.around(matrix);

  while (toVisit.length !== 0) {
    const uniqueToVisit = toVisit.filter(
      (spot) => !visited.has(spot.toString())
    );

    uniqueToVisit.forEach((spot) => visited.set(spot.toString(), spot));

    toVisit = uniqueToVisit.flatMap((spot) => spot.around(matrix));
  }

  return visited;
};

const input = loadInput();

const matrix = toMatrix(input);

const spots = toSpotMatrix(matrix);

const trailheads = findTrailheads(spots);

const singleTrails = trailheads.map((head) => findSingleTrail(spots, head));

const scores = singleTrails.map(
  (trail) =>
    Array.from(trail.values()).filter((spot) => spot.height === 9).length
);

console.log(sum(scores));
