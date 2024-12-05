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

const input = loadInput();

const rules = getPageOrderingRules(input);
const updates = getUpdates(input);

const validUpdates = updates.filter((update) =>
  isUpdateFollowingRules(update, rules)
);

console.log(sum(validUpdates.map(getMiddle)));
