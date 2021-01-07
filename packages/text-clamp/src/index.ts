import {
  computedStyle,
  getLastChild,
  getMaxHeight,
  getMaxLines,
} from "./utils";

/**
 * Callback when element truncated
 */
export type OnClampedCallback = (
  el: HTMLElement,
  clampValue: number,
  maxHeight: number
) => void;

/**
 * Clamp options.
 */
export type Options = {
  clamp?: number | string | "auto";
  useNativeClamp?: boolean;
  splitOnChars?: string[];
  animate?: boolean | number;
  truncationChar?: string;
  truncationHTML?: string;
  onClamped?: OnClampedCallback;
};

/**
 * Clamp a element's text to n lines.
 * Copies from https://github.com/josephschmitt/Clamp.js
 *
 * @param el The element to be truncated.
 * @param options The line number or options.
 */
export default function TextClamp(
  el: HTMLElement,
  options?: number | string | Options
): void {
  if (!el || !el.ownerDocument) {
    throw new TypeError("invalid element.");
  }

  if (typeof options === "number" || typeof options === "string") {
    options = {
      clamp: options,
    };
  }

  const opt: Required<Options> = {
    clamp: options?.clamp ?? 2,
    useNativeClamp:
      (options?.useNativeClamp ?? true) &&
      typeof el.style.webkitLineClamp != "undefined",
    // Split on sentences (periods), hypens, en-dashes, em-dashes, and words (spaces).
    splitOnChars: options?.splitOnChars || [".", "-", "–", "—", " "],
    animate: options?.animate ?? false,
    truncationChar: options?.truncationChar ?? "…",
    truncationHTML: options?.truncationHTML ?? "",
    onClamped:
      typeof options?.onClamped === "function" ? options.onClamped : () => true,
  };

  let clampValue: number,
    maxHeight = -1;

  let styleHeightValue = "";

  if (opt.clamp === "auto") {
    clampValue = getMaxLines(el);
  } else if (typeof opt.clamp === "string") {
    if (opt.clamp.indexOf("px") > -1) {
      maxHeight = parseInt(opt.clamp);
      clampValue = getMaxLines(el, maxHeight);

      styleHeightValue = opt.clamp;
    } else if (opt.clamp.indexOf("em") > -1) {
      const fts = computedStyle(el, "font-size");

      maxHeight = Math.floor(parseFloat(opt.clamp) * parseFloat(fts));
      clampValue = getMaxLines(el, maxHeight);

      styleHeightValue = opt.clamp;
    } else if (opt.clamp.indexOf("rem") > -1) {
      const rfts = computedStyle(el.ownerDocument.documentElement, "font-size");

      maxHeight = Math.floor(parseFloat(opt.clamp) * parseFloat(rfts));
      clampValue = getMaxLines(el, maxHeight);

      styleHeightValue = opt.clamp;
    } else {
      clampValue = parseInt(opt.clamp);
    }
  } else {
    clampValue = opt.clamp;
  }

  if (maxHeight < 0) {
    maxHeight = getMaxHeight(el, clampValue);
  }

  if (opt.useNativeClamp && !opt.truncationHTML) {
    el.style.overflow = "hidden";
    el.style.textOverflow = "ellipsis";
    el.style.webkitBoxOrient = "vertical";
    el.style.display = "-webkit-box";
    el.style.webkitLineClamp = String(clampValue);

    if (styleHeightValue) {
      el.style.height = styleHeightValue;
    }
  } else {
    if (maxHeight <= el.clientHeight) {
      truncate(
        el,
        maxHeight,
        {
          splitOnChars: opt.splitOnChars,
          animate: opt.animate,
          truncationChar: opt.truncationChar,
          truncationHTML: opt.truncationHTML,
        },
        function () {
          if (styleHeightValue) {
            el.style.height = styleHeightValue;
          }

          opt.onClamped(el, clampValue, maxHeight);
        }
      );
    }
  }
}

function truncate(
  el: HTMLElement,
  maxHeight: number,
  opts: Pick<
    Required<Options>,
    "splitOnChars" | "animate" | "truncationChar" | "truncationHTML"
  >,
  callback: () => void
): void {
  const doc = el.ownerDocument;
  if (!doc) {
    callback();
    return;
  }

  let splitChars: string[] = [...opts.splitOnChars],
    splitChar = "",
    chunks: string[] | null = null;

  const doTruncate = (target: Node | null) => {
    let nodeValue: string | null;

    if (!target || !(nodeValue = target.nodeValue) || !maxHeight) {
      callback();
      return;
    }

    if (!chunks) {
      splitChar = splitChars.shift() ?? "";

      chunks = nodeValue.split(splitChar);
    }

    // If there are chunks left to remove, remove the last one and see if
    // the nodeValue fits.
    if (chunks.length > 1) {
      // remove last chunk
      chunks.pop();

      const newNodeValue = chunks.join(splitChar);

      const extraNodes: Node[] = [];

      if (opts.truncationHTML) {
        target.nodeValue = newNodeValue;

        const container = doc.createElement("div");
        container.innerHTML = opts.truncationHTML;

        let firstChild;
        while ((firstChild = container.firstChild)) {
          extraNodes.push(firstChild);

          el.appendChild(firstChild);
        }

        if (opts.truncationChar) {
          const charNode = doc.createTextNode(opts.truncationChar);

          extraNodes.push(charNode);
          el.appendChild(charNode);
        }
      } else {
        // apply ellipsis
        target.nodeValue = newNodeValue + opts.truncationChar;
      }

      // It fits
      if (el.clientHeight <= maxHeight) {
        // There's still more characters to try splitting on, not quite done yet
        if (splitChars.length >= 0 && splitChar !== "") {
          // recover node
          target.nodeValue = nodeValue;
          chunks = null;
        } else {
          // Finished!
          callback();
          return;
        }
      }

      let n;
      while ((n = extraNodes.shift())) {
        el.removeChild(n);
      }
    } else {
      chunks = null;

      // No valid chunks even when splitting by letter, time to move
      // on to the next node
      if (splitChar === "") {
        // empty text node, this will be remove from parent
        target.nodeValue = "";

        target = getLastValidTextNode(el);

        splitChars = [...opts.splitOnChars];
        splitChar = "";
      }
    }

    if (opts.animate) {
      if (
        typeof opts.animate === "number" ||
        typeof requestAnimationFrame !== "function"
      ) {
        setTimeout(
          function () {
            doTruncate(target);
          },
          opts.animate === true ? 16.6 /* 1000 / 60 */ : opts.animate
        );
      } else {
        requestAnimationFrame(function () {
          doTruncate(target);
        });
      }
    } else {
      doTruncate(target);
    }
  };

  doTruncate(getLastValidTextNode(el));
}

function getLastValidTextNode(el: Element): Node | null {
  const doGetLastValidTextNode: (
    target: typeof el
  ) => ReturnType<typeof getLastValidTextNode> = (target) => {
    const lastChild = getLastChild(target);

    if (!lastChild) return null;

    const nodeValue = lastChild.nodeValue;

    // This is the absolute last child, a text node, but something's wrong with it. Remove it and keep trying
    if (!nodeValue || nodeValue.trim() === "") {
      lastChild.parentNode?.removeChild(lastChild);
      return doGetLastValidTextNode(el);
    }

    return lastChild;
  };

  return doGetLastValidTextNode(el);
}
