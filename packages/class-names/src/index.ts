export default function classNames(...args: any[]): string {
  const classes: (string | number)[] = [];

  for (const arg of args) {
    if (!arg) continue;

    if (typeof arg === "string" || typeof arg === "number") {
      classes.push(arg);
    } else if (Array.isArray(arg) && arg.length > 0) {
      const innerNames = classNames(...arg);
      if (innerNames) {
        classes.push(innerNames);
      }
    } else if (typeof arg === "object") {
      for (const key in arg) {
        if (Object.prototype.hasOwnProperty.call(arg, key) && arg[key]) {
          classes.push(key);
        }
      }
    }
  }

  return classes.join(" ");
}
