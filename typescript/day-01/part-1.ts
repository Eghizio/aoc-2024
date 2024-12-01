import { loadInput, sum, toInt } from "../utils";

const input = loadInput();

const list = input.split("\n").map((line) => {
  const [x, y] = line.split(" ".repeat(3));
  return { x: toInt(x), y: toInt(y) };
});

const distance = (a: number, b: number) => Math.abs(a - b);

const xs = list.map((line) => line.x).toSorted();
const ys = list.map((line) => line.y).toSorted();

const distances = xs.map((x, i) => distance(x, ys[i]));

console.log(sum(distances));
