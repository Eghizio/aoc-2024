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

const getDistinctTrails = (trail: Map<string, Spot>): Map<string, string[]> => {
  const spots = Array.from(trail.values());

  const walks = spots.map(
    (spot) =>
      [
        spot.toString(),
        spots
          .filter((target) => spot.canAdvance(target))
          .map((s) => s.toString()),
      ] as const
  );

  const steps: Map<string, string[]> = new Map(walks);

  return steps;
};

const isNeighbour = (
  { position }: Spot,
  { position: { x, y } }: Spot
): boolean => Math.abs(position.x - x) + Math.abs(position.y - y) === 1;

const makeTrails = (steps: Map<string, string[]>) => {
  steps = new Map(
    Array.from(steps.entries()).map(([key, targets]) => [
      key,
      targets.filter((spot) =>
        isNeighbour(Spot.deserialize(key), Spot.deserialize(spot))
      ),
    ])
  );

  const [trailhead] = steps.keys();
  let trails: Set<string>[] = [new Set([trailhead])];

  for (const i of Array.from({ length: 9 }, (_, i) => i)) {
    const next = trails.flatMap((trail) => {
      const last = [...trail.values()].pop();
      if (!last) throw new Error("Never");

      const toVisit = steps.get(last) ?? [];

      return toVisit.map((target) => new Set([...trail, target]));
    });

    trails = next;
  }

  return trails;
};

const rateTrail = (trail: Set<string>[]): number =>
  trail.filter((set) => set.size === 10).length;

const input = loadInput();

const matrix = toMatrix(input);
const spots = toSpotMatrix(matrix);
const trailheads = findTrailheads(spots);

const singleTrails = trailheads.map((head) => findSingleTrail(spots, head));

const distinctTrails = singleTrails.map(getDistinctTrails);

const trails = distinctTrails.map(makeTrails);

const scores = trails.map(rateTrail);

console.log(sum(scores));
