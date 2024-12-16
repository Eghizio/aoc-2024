import { loadInput, sum, toInt } from "../utils";

const multiply = (numbers: number[]) =>
  numbers.length === 0 ? 0 : numbers.reduce((acc, num) => acc * num, 1);

const toEquations = (input: string): number[][] =>
  input.split("\n").map((line) => {
    const [result, nums] = line.split(": ");
    const numbers = nums.split(" ").map(toInt);
    return [toInt(result), ...numbers];
  });

const toResults = ([result]: number[]): number => result;

const generateCombinations = (amount: number): number[][] =>
  Array.from({ length: 2 ** amount }, (_, i) =>
    i.toString(2).padStart(amount, "0").split("").map(Number)
  );

const combinationToOperation = (combination: number) =>
  combination ? sum : multiply;

const calculateEquation = (
  numbers: number[],
  operations: ((xs: number[]) => number)[]
): number => {
  const [head, ...tail] = numbers;
  return tail.reduce((acc, num, i) => operations[i]([acc, num]), head);
};

const isValidEquationWithCombination = (
  [result, ...numbers]: number[],
  combinationsPool: number[][][]
): boolean => {
  const numberOfOperators = numbers.length - 1;
  const combinations = combinationsPool[numberOfOperators];

  const operationsCombinations = combinations.map((combination) =>
    combination.map(combinationToOperation)
  );

  return operationsCombinations.some(
    (operations) => calculateEquation(numbers, operations) === result
  );
};

const input = loadInput();

const equations = toEquations(input);

const combinations = Array.from({ length: 12 }, (_, i) =>
  generateCombinations(i)
);

const validEquations = equations.filter((eq) =>
  isValidEquationWithCombination(eq, combinations)
);

const validResults = validEquations.map(toResults);

console.log(sum(validResults));
