// N-Queens Problem — Backtracking
// Time: O(N!)  Space: O(N)
// Best: O(N)  Avg: O(N!)  Worst: O(N!)

export interface AlgoResult<T> {
  result: T;
  timeMs: number;
  operationsCount: number;
}

export interface QueenSolution {
  board: number[];
  solutions: number[][];
  count: number;
}

export function nQueens(n: number): AlgoResult<QueenSolution> {
  const start = performance.now();
  let operationsCount = 0;
  const board: number[] = new Array(n).fill(-1);
  const solutions: number[][] = [];

  function isSafe(row: number, col: number): boolean {
    operationsCount++;
    for (let r = 0; r < row; r++) {
      if (board[r] === col) return false;
      if (Math.abs(board[r] - col) === Math.abs(r - row)) return false;
    }
    return true;
  }

  function solve(row: number) {
    operationsCount++;
    if (row === n) {
      solutions.push([...board]);
      return;
    }
    for (let col = 0; col < n; col++) {
      if (isSafe(row, col)) {
        board[row] = col;
        solve(row + 1);
        board[row] = -1;
      }
    }
  }

  solve(0);

  const timeMs = performance.now() - start;
  return {
    result: { board: solutions[0] ?? new Array(n).fill(-1), solutions, count: solutions.length },
    timeMs,
    operationsCount,
  };
}
