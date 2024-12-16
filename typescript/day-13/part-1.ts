import { ArrayOf, loadInput, sum, toInt } from "../utils";

type XY = [x: number, y: number];

type Machine = { a: XY; b: XY; prize: XY };

const toClawMachines = (input: string): Machine[] =>
  input
    .replaceAll("Button A: ", "")
    .replaceAll("Button B: ", "")
    .replaceAll("Prize: ", "")
    .split("\n\n")
    .map((machine) => {
      const [a, b, prize] = machine.split("\n").map<XY>((xy) => {
        const [x, y] = xy.split(", ");
        return [toInt(x.slice(2)), toInt(y.slice(2))];
      });

      return { a, b, prize };
    });

const isPrizeWithinReach = ({
  a: [ax, ay],
  b: [bx, by],
  prize: [x, y],
}: Machine): boolean => {
  const MAX_ATTEMPTS = 100;
  const maxX = (ax + bx) * MAX_ATTEMPTS;
  const maxY = (ay + by) * MAX_ATTEMPTS;
  return x < maxX && y < maxY;
};

const calculateCost = (a: number, b: number): number => {
  const aPrice = 3;
  const bPrice = 1;
  return a * aPrice + b * bPrice;
};

const costAttempts = ArrayOf(101)
  .flatMap((a) =>
    ArrayOf(101).map<[number, number, number]>((b) => [
      a,
      b,
      calculateCost(a, b),
    ])
  )
  .sort(([_a, _b, xCost], [__a, __b, yCost]) => xCost - yCost);

const getWinningCombination = ({
  a: [ax, ay],
  b: [bx, by],
  prize: [x, y],
}: Machine): XY => {
  for (const attempt of costAttempts) {
    const [a, b] = attempt;

    const X = a * ax + b * bx;
    const Y = a * ay + b * by;

    if (X === x && Y === y) {
      return [a, b];
    }
  }

  return [0, 0];
};

const input = loadInput();
const clawMachines = toClawMachines(input);
const winnableMachines = clawMachines.filter(isPrizeWithinReach);
const winningCombinations = winnableMachines.map(getWinningCombination);
const priceOfAVictory = winningCombinations.map(([a, b]) =>
  calculateCost(a, b)
);

console.log(sum(priceOfAVictory));
