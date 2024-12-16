import { loadInput, sum, toInt } from "../utils";

const toDisk = (input: string): number[] => input.split("").map(toInt);

const toFileBlocks = (disk: number[]): number[] => {
  return disk.reduce<{ blocks: number[]; id: number }>(
    (acc, blockSize, i) => {
      const isFile = i % 2 === 0;

      if (isFile) {
        const fileBlock = Array.from({ length: blockSize }, () => acc.id);
        return {
          blocks: [...acc.blocks, ...fileBlock],
          id: acc.id + 1,
        };
      }

      const emptyBlock = Array.from({ length: blockSize }, () => -1);
      return {
        blocks: [...acc.blocks, ...emptyBlock],
        id: acc.id,
      };
    },
    { blocks: [], id: 0 }
  ).blocks;
};

// replace/remove -1
const toCompactedFileBlocks = (fileBlocks: number[]): number[] => {
  let i = 0;

  while (fileBlocks.includes(-1)) {
    if (fileBlocks[i] !== -1) {
      i++;
      continue;
      // what about -1 at the end? it will add redundant copy/copies?
    }

    let last = fileBlocks.pop();
    while (last === -1) {
      last = fileBlocks.pop();
    }

    if (last) fileBlocks[i] = last;

    i++;
  }

  // Off by one empty (pre last). Will fix indexing later.
  const last = fileBlocks.pop() ?? -1;
  fileBlocks.pop();
  fileBlocks.push(last);

  return fileBlocks;
};

const calculateChecksum = (block: number[]) => sum(block.map((x, i) => x * i));

const GetInput = (): string => {
  const testInput = `2333133121414131402`; // 1928
  const testInput2 = `12345`;
  const customTestInput = `1010101010101010101012121`;
  const extendedTestInput = `233313312141413140211`; // 2132

  // return testInput;
  // return testInput2;
  // return customTestInput;
  // return extendedTestInput;

  return loadInput();
};

const FileBlockLookup = (b: number[]): string =>
  b.map((d) => (d === -1 ? "." : d)).join("");
const CompactedFileBlockLookup = (b: number[]): string => b.join("");

const input = GetInput();
const disk = toDisk(input);
const fileBlocks = toFileBlocks(disk);
const compactedFileBlocks = toCompactedFileBlocks([...fileBlocks]);

// console.log(disk, "\n\n");
// console.log(fileBlocks, "\n\n");
// console.log(FileBlockLookup(fileBlocks), "\n\n");
// console.log(compactedFileBlocks, "\n\n");
// console.log(CompactedFileBlockLookup(compactedFileBlocks), "\n\n");

console.log(calculateChecksum(compactedFileBlocks));
// 6401092024606 bad.
// 6400828038148 bad.
