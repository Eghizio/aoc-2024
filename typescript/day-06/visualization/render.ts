type Position = { x: number; y: number };

const serializePosition = ({ x, y }: Position) => `${x}_${y}`;

export const renderMatrix = (
  matrix: string[][],
  trace: Set<string>,
  start: Position
) => {
  const mapping: Record<string, string> = {
    "#": "🔴",
    ".": "⚪",
    "^": "🟢",
    "@": "🟡",
    O: "🟣",
    // TOP: "⬆️",
    // RIGHT: "➡️",
    // LEFT: "⬅️",
    // DOWN: "⬇️",
  };
  for (let y = 0; y < matrix.length; y++) {
    let row = "";
    for (let x = 0; x < matrix[y].length; x++) {
      const visited =
        [...trace.values()].find((s) =>
          s.startsWith(serializePosition({ x, y }))
        ) !== undefined;

      const isStartingPosition = x === start.x && y === start.y;
      const char = isStartingPosition ? "^" : visited ? "@" : matrix[y][x];
      row = `${row}${mapping[char]}`;
    }
    console.log(row);
  }
};
