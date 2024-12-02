import { loadInput, toInt } from "../utils";

const toReports = (input: string) =>
  input.split("\n").map((line) => line.split(" ").map(toInt));

const toDeltas = (report: number[]) =>
  report.map((level, i, arr) => level - arr[i - 1]).slice(1);

const isSafeRange = (delta: number) => [1, 2, 3].includes(Math.abs(delta));
const isNegative = (x: number) => x < 0;
const isPositive = (x: number) => x > 0;

const isSafe = (deltas: number[]) => {
  const allDecreasing = deltas.every(
    (delta) => isSafeRange(delta) && isNegative(delta)
  );
  const allIncreasing = deltas.every(
    (delta) => isSafeRange(delta) && isPositive(delta)
  );

  return allDecreasing || allIncreasing;
};

const input = loadInput();

const reports = toReports(input);

const reportDeltas = reports.map(toDeltas);

console.log(reportDeltas.filter(isSafe).length);
