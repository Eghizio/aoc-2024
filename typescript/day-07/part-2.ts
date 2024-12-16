import { loadInput, sum, toInt } from "../utils";

const multiply = (numbers: number[]) =>
  numbers.length === 0 ? 0 : numbers.reduce((acc, num) => acc * num, 1);

const concatenate = (numbers: number[]): number =>
  toInt(numbers.reduce((acc, num) => acc + num.toString(), ""));

const toEquations = (input: string): number[][] =>
  input.split("\n").map((line) => {
    const [result, nums] = line.split(": ");
    const numbers = nums.split(" ").map(toInt);
    return [toInt(result), ...numbers];
  });

const toResults = ([result]: number[]): number => result;

const generateCombinations = (amount: number): number[][] =>
  Array.from({ length: 3 ** amount }, (_, i) =>
    i.toString(3).padStart(amount, "0").split("").map(Number)
  );

const combinationToOperation = (combination: number) => {
  switch (combination) {
    case 0:
      return sum;
    case 1:
      return multiply;
    case 2:
      return concatenate;
    default:
      throw new Error("Invalid combination");
  }
};

const generateCombinationsCache = (equations: number[][]): number[][][] => {
  const maxPossibleOperations = Math.max(
    ...equations.map((eq) => eq.length - 2)
  );

  return Array.from({ length: maxPossibleOperations + 1 }, (_, i) =>
    generateCombinations(i)
  );
};

const calculateEquation = (
  numbers: number[],
  operations: ((xs: number[]) => number)[]
): number => {
  const [head, ...tail] = numbers;
  return tail.reduce((acc, num, i) => operations[i]([acc, num]), head);
};

const isValidEquationWithCombination = (
  [result, ...numbers]: number[],
  combinationsCache: number[][][]
): boolean => {
  const numberOfOperators = numbers.length - 1;
  const combinations = combinationsCache[numberOfOperators];

  const operationsCombinations = combinations.map((combination) =>
    combination.map(combinationToOperation)
  );

  return operationsCombinations.some(
    (operations) => calculateEquation(numbers, operations) === result
  );
};

const input = loadInput();

const equations = toEquations(input);

const combinations = generateCombinationsCache(equations);

const validEquations = equations.filter((eq) =>
  isValidEquationWithCombination(eq, combinations)
);

const validResults = validEquations.map(toResults);

console.log(sum(validResults));
