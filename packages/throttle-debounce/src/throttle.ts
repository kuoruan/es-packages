/**
 * Get the throttled function
 *
 * @param func The function to be throttled.
 * @param threshhold The threshhold in milliseconds, a zero or greater number.
 * @param scope The context used by func.apply().
 */
export default function <T extends (...args: any[]) => any>(
  func: T,
  threshhold = 20,
  /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
  scope?: any
): T {
  if (threshhold < 0) {
    throw new TypeError("invalid threshhold value.");
  }

  let timer: ReturnType<typeof setTimeout> | null = null;
  let rtn: any;

  return <T>function (this: any, ...args: any[]): any {
    if (!timer) {
      const ctx = typeof scope === "undefined" ? this : scope;

      timer = setTimeout(() => {
        timer = null;
        rtn = func.apply(ctx, args);
      }, threshhold);
    }

    return rtn;
  };
}
