// Type definitions for tools.prng.js
// Definitions by: Xingwang Liao <https://github.com/kuoruan>
// TypeScript Version: 3.8

export as namespace prng;

export = prng;

declare namespace prng {
  function get(min?: number, max?: number): number;

  function int(): number;

  function seed(n: number): void;
}
