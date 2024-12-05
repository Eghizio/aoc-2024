import { loadInput, sum, toInt } from "../utils";

type Rules = Map<number, Set<number>>;
const getPageOrderingRules = (input: string): Rules => {
  const [rules] = input.split("\n\n");
  const pairs = rules.split("\n").map((rule) => rule.split("|").map(toInt));

  return pairs.reduce((census, [x, y]) => {
    const previous = census.get(x) ?? new Set();
    return census.set(x, previous.add(y));
  }, new Map<number, Set<number>>());
};

const getUpdates = (input: string): number[][] => {
  const [_, updates] = input.split("\n\n");
  return updates.split("\n").map((update) => update.split(",").map(toInt));
};

const isUpdateFollowingRules = (update: number[], rules: Rules): boolean => {
  return update.every((page, i, arr) => {
    const ys = rules.get(page);
    const nextUpdatedPages = arr.slice(i + 1);
    return nextUpdatedPages.every((p) => ys?.has(p));
  });
};

const getMiddle = <T>(arr: T[]): T => arr[Math.floor(arr.length / 2)];

const fixOrderOfUpdates = (update: number[], rules: Rules): number[] => {
  for (const _ in update) {
    for (const index in update.slice(0, -1)) {
      const i = toInt(index);
      const current = update[i];
      const next = update[i + 1];

      const allowedAfter = rules.get(current) ?? new Set();

      if (!allowedAfter.has(next)) {
        update[i] = next;
        update[i + 1] = current;
      }
    }
  }

  return update;
};

const input = loadInput();

const rules = getPageOrderingRules(input);
const updates = getUpdates(input);

const invalidUpdates = updates.filter(
  (update) => !isUpdateFollowingRules(update, rules)
);

const fixedUpdates = invalidUpdates.map((update) =>
  fixOrderOfUpdates(update, rules)
);

console.log(sum(fixedUpdates.map(getMiddle)));
