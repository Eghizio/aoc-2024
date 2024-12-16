import { loadInput, sum, toInt, ArrayOf } from "../utils";

const toStones = (line: string) => line.split(" ");

const mapStone = (stone: string): string[] => {
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
  ArrayOf(times).reduce((acc, i) => acc.flatMap(mapStone), stones);

const blinkAtStonesAndCount = (stones: string[], times: number): number => {
  const counts = ArrayOf(times).reduce((counters) => {
    const localCounter = new Map<string, number>();

    for (const [stone, count] of counters) {
      const blinkedStones = blinkAtStones([stone], 1);

      for (const stone of blinkedStones) {
        localCounter.set(stone, (localCounter.get(stone) ?? 0) + count);
      }
    }

    return localCounter;
  }, new Map<string, number>(stones.map((s) => [s, 1])));

  return sum([...counts.values()]);
};

const input = loadInput();

const stones = toStones(input);

const stonesCount = blinkAtStonesAndCount(stones, 25);

console.log(stonesCount);
