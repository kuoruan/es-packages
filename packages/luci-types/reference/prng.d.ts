declare namespace LuCI {
  class prng extends LuCI.baseclass {
    get(min?: number, max?: number): number;

    int(): number;

    seed(n: number): void;
  }
}
