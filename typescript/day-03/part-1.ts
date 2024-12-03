import { loadInput, sum, toInt } from "../utils";

const getPairs = (input: string) => {
  const matches = input.matchAll(new RegExp(/mul\(\d{1,3},\d{1,3}\)/g));
  const operations = Array.from(matches).map(([match]) => match);

  return operations.map((op) => op.slice(4, -1).split(",").map(toInt));
};

const multiplyPairs = (pairs: number[][]): number[] => {
  return pairs.map(([a, b]) => a * b);
};

const input = loadInput();

const pairs = getPairs(input);

console.log(sum(multiplyPairs(pairs)));
