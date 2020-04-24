export default function classNames(...args: any[]): string {
  const classes: (string | number)[] = [];

  for (const arg of args) {
    if (!arg) continue;

    const argType = typeof arg;

    if (argType === "string" || argType === "number") {
      classes.push(arg);
    } else if (Array.isArray(arg) && arg.length > 0) {
      const innerNames = classNames(...arg);
      if (innerNames) {
        classes.push(innerNames);
      }
    } else if (argType === "object") {
      for (const key in arg) {
        if (arg.hasOwnProperty(key) && arg[key]) {
          classes.push(key);
        }
      }
    }
  }

  return classes.join(" ");
}
