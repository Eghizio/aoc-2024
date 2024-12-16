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

// Replace/Remove -1
const toCompactedFileBlocks = (fileBlocks: number[]): number[] => {
  let i = 0;

  while (fileBlocks.includes(-1)) {
    if (fileBlocks[i] !== -1) {
      i++;
      continue;
      // What about -1 at the end? it will add redundant copy/copies?
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

const input = loadInput();
const disk = toDisk(input);
const fileBlocks = toFileBlocks(disk);
const compactedFileBlocks = toCompactedFileBlocks([...fileBlocks]);

console.log(calculateChecksum(compactedFileBlocks));
