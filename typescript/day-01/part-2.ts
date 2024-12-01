import { loadInput, sum, toInt } from "../utils";

const input = loadInput();

const list = input.split("\n").map((line) => {
  const [x, y] = line.split(" ".repeat(3));
  return { x: toInt(x), y: toInt(y) };
});

const xs = list.map((line) => line.x).toSorted();
const ys = list.map((line) => line.y).toSorted();

const xsCountMultiplied = xs.map((x) => x * ys.filter((y) => y === x).length);

const similarityScore = sum(xsCountMultiplied);

console.log(similarityScore);
