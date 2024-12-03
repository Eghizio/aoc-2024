import { loadInput, sum, toInt } from "../utils";

const getOperations = (input: string) => {
  const matches = input.matchAll(
    new RegExp(/mul\(\d{1,3},\d{1,3}\)|do\(\)|don't\(\)/g)
  );
  return Array.from(matches).map(([match]) => match);
};

const runOperationEnabler = (operations: string[]) =>
  operations.reduce<{ muls: string[]; enabled: boolean }>(
    (acc, operation) => {
      switch (operation) {
        case "do()":
          return { ...acc, enabled: true };
        case "don't()":
          return { ...acc, enabled: false };
        default:
          const muls = acc.enabled ? [...acc.muls, operation] : acc.muls;
          return { ...acc, muls };
      }
    },
    { muls: [], enabled: true }
  ).muls;

const getPairs = (mulOperations: string[]) =>
  mulOperations.map((op) => op.slice(4, -1).split(",").map(toInt));

const multiplyPairs = (pairs: number[][]): number[] =>
  pairs.map(([a, b]) => a * b);

const input = loadInput();

const operations = getOperations(input);

const mulOperations = runOperationEnabler(operations);

const pairs = getPairs(mulOperations);

console.log(sum(multiplyPairs(pairs)));
