import { loadInput, sum, toMatrix } from "../utils";
import { Matrix, Plot } from "./lib";

const toPlotMatrix = (input: string): Matrix<Plot> =>
  toMatrix(input, ([p, x, y]) => new Plot(x, y, p));

const findRegions = (matrix: Matrix<Plot>): Set<Plot>[] => {
  const regions: Set<Plot>[] = [];
  const visitedPlots = new Set<Plot>();

  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      const head = matrix[y][x];

      if (visitedPlots.has(head)) continue;
      visitedPlots.add(head);

      const region = new Set<Plot>([head]);

      let toVisit = head.around(matrix);

      const shouldBeAddedToRegion = (plot: Plot): boolean => {
        if (region.has(plot)) return false;
        if (head.plant !== plot.plant) return false;
        if (visitedPlots.has(plot)) return false;
        return true;
      };

      while (toVisit.length !== 0) {
        const belongingToRegion = toVisit.filter(shouldBeAddedToRegion);

        belongingToRegion.forEach((plot) => {
          visitedPlots.add(plot);
          region.add(plot);
        });

        toVisit = Array.from(
          new Set(belongingToRegion.flatMap((plot) => plot.around(matrix)))
        );
      }

      regions.push(region);
    }
  }

  return regions;
};

const calculateArea = (region: Set<Plot>): number => region.size;

const calculatePerimeter = (region: Set<Plot>, matrix: Matrix<Plot>): number =>
  Array.from(region).flatMap((p) => p.perimeter(matrix)).length;

const calculateFencePrice = (region: Set<Plot>, matrix: Matrix<Plot>): number =>
  calculateArea(region) * calculatePerimeter(region, matrix);

const input = loadInput();

const matrix = toPlotMatrix(input);

const regions = findRegions(matrix);

const fencePrices = regions.map((region) =>
  calculateFencePrice(region, matrix)
);

console.log(sum(fencePrices));
