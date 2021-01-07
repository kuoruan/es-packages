/**
 * Get the debounced function
 *
 * @param func The function to be debounced.
 * @param delay The delay in milliseconds, a zero or greater number.
 * @param scope The context used by func.apply().
 */
export default function <T extends (...args: any[]) => any>(
  func: T,
  delay = 20,
  /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
  scope?: any
): T {
  if (delay < 0) {
    throw new TypeError("invalid delay value");
  }

  let timer: ReturnType<typeof setTimeout> | null = null;
  let rtn: any;

  return <T>function (this: any, ...args: any[]): any {
    if (timer) {
      clearTimeout(timer);
    }

    const ctx = typeof scope === "undefined" ? this : scope;

    timer = setTimeout(() => {
      timer = null;
      rtn = func.apply(ctx, args);
    }, delay);

    return rtn;
  };
}
