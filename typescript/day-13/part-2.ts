import { loadInput, sum, toInt } from "../utils";

type XY = [x: number, y: number];

type Machine = { a: XY; b: XY; prize: XY };

const PRIZE_OFFSET = 10_000_000_000_000;

const toClawMachines = (input: string): Machine[] =>
  input
    .replaceAll("Button A: ", "")
    .replaceAll("Button B: ", "")
    .replaceAll("Prize: ", "")
    .split("\n\n")
    .map((machine) => {
      const [a, b, [x, y]] = machine.split("\n").map<XY>((xy) => {
        const [x, y] = xy.split(", ");
        return [toInt(x.slice(2)), toInt(y.slice(2))];
      });

      return { a, b, prize: [x + PRIZE_OFFSET, y + PRIZE_OFFSET] };
    });

const calculateCost = (a: number, b: number): number => {
  const aPrice = 3;
  const bPrice = 1;
  return a * aPrice + b * bPrice;
};

const machineToEquation = ({
  a: [a1, a2],
  b: [b1, b2],
  prize: [c1, c2],
}: Machine) => [a1, b1, c1, a2, b2, c2] as const;

const cramer = (
  a1: number,
  b1: number,
  c1: number,

  a2: number,
  b2: number,
  c2: number
) => {
  const W = a1 * b2 - b1 * a2;
  const Wx = c1 * b2 - b1 * c2;
  const Wy = a1 * c2 - c1 * a2;

  const x = Wx / W;
  const y = Wy / W;

  return [x, y];
};

const input = loadInput();
const clawMachines = toClawMachines(input);

const equations = clawMachines.map(machineToEquation);
const results = equations.map((abcs) => cramer(...abcs));

const pricesOfAVictory = results
  .map(([a, b]) => calculateCost(a, b))
  .filter(Number.isInteger);

console.log(sum(pricesOfAVictory));
