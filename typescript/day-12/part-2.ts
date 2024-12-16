import { ArrayOf, loadInput, toInt, sum, toMatrix } from "../utils";
import { Matrix, Plot } from "./lib";

const isDebug = false;
const debugLog = (...args: any[]) => isDebug && console.log(...args);

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

      debugLog("=".repeat(42));
      debugLog("Head:", head); // debug

      while (toVisit.length !== 0) {
        const belongingToRegion = toVisit.filter(shouldBeAddedToRegion);

        belongingToRegion.forEach((plot) => {
          visitedPlots.add(plot);
          region.add(plot);
        });

        // console.log("H:", head); //debug
        debugLog("H:", head); //debug
        debugLog("\n".repeat(1)); //debug
        debugLog("V:", toVisit); //debug
        debugLog("B:", belongingToRegion); //debug
        debugLog("\nR:", region); //debug
        debugLog("\n".repeat(1), ".".repeat(42)); //debug

        toVisit = Array.from(
          new Set(belongingToRegion.flatMap((plot) => plot.around(matrix)))
        );
      }

      // console.log(region);

      regions.push(region);
    }
  }

  return regions;
};

// const serializeRegion = (region: Set<Plot>): string =>
//   Array.from(region).toSorted().join("+");

// const deserializeRegion = (region: string): Set<Plot> =>
//   new Set(region.split("+").map((p) => Plot.deserialize(p)));

// const getUniqueRegions = (regions: Set<Plot>[]): Set<Plot>[] => {
//   const serialized = regions.map(serializeRegion);

//   const uniques = new Set(serialized);
//   const uniqueRegions = Array.from(uniques).map((s) => deserializeRegion(s));

//   return uniqueRegions;
// };

const calculateArea = (region: Set<Plot>): number => region.size;

const getPerimeter = (region: Set<Plot>, matrix: Matrix<Plot>): Plot[] =>
  Array.from(region).flatMap((p) => p.perimeter(matrix));

const calculateSides = (region: Set<Plot>, matrix: Matrix<Plot>): number => {
  // TODO.
  const perimeter = getPerimeter(region, matrix);
  console.log("P:", perimeter);
  return -1;
};

const calculateFencePrice = (region: Set<Plot>, matrix: Matrix<Plot>): number =>
  calculateArea(region) * calculateSides(region, matrix);

const GetInput = () => {
  const testInput = `RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`;
  const testInput2 = `AAAA
BBCD
BBCC
EEEC`;
  const testInput3 = `OOOOO
OXOXO
OOOOO
OXOXO
OOOOO`;

  return testInput2; // 140

  // return testInput; // 1930
  // return testInput3; // 772

  return loadInput();
};

const DrawMatrix = (matrix: Matrix<Plot>) => {
  console.log(matrix.map((row) => row.map((p) => p.plant)));
};

const input = GetInput();

const matrix = toPlotMatrix(input);
DrawMatrix(matrix);
// console.log(matrix);

const regions = findRegions(matrix);

const fencePrices = regions.map((region) =>
  calculateFencePrice(region, matrix)
);

debugLog("+".repeat(42));

// debugLog(regions);
// console.log(regions.length);

console.log(sum(fencePrices)); // 81003 too low.
