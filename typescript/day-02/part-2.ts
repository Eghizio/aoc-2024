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

const permutateReport = (report: number[]): number[][] =>
  Array.from({ length: report.length }, (_, index) =>
    report.filter((_, i) => i !== index)
  );

const isDampenedReportSafe = (report: number[]): boolean => {
  if (isSafe(toDeltas(report))) return true;

  const permutations = permutateReport(report);
  const dampenedDeltas = permutations.map(toDeltas);

  return dampenedDeltas.some(isSafe);
};

const input = loadInput();

const reports = toReports(input);

console.log(reports.filter(isDampenedReportSafe).length);
