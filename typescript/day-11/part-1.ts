import { ArrayOf, loadInput, toInt } from "../utils";

const toStones = (line: string) => line.split(" ");

const mapStone = (stone: string) => {
  if (stone === "0") return ["1"];

  if (stone.length % 2 === 0) {
    const half = stone.length / 2;
    const a = stone.slice(0, half);
    const b = stone.slice(half);

    return [toInt(a).toString(), toInt(b).toString()];
  }

  return [(toInt(stone) * 2024).toString()];
};

const blinkAtStones = (stones: string[], times: number): string[] =>
  ArrayOf(times).reduce((acc) => acc.flatMap(mapStone), stones);

const input = loadInput();

const stones = toStones(input);

const blinkedStones = blinkAtStones(stones, 25);

console.log(blinkedStones.length);
