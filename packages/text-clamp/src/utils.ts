/**
 * Return the current style for an element.
 *
 * @param el The element to compute.
 */
export function computedStyle(el: HTMLElement, prop: string): string {
  return window.getComputedStyle(el).getPropertyValue(prop);
}

/**
 * Returns the line-height of an element as an integer.
 *
 * @param el The element to compute
 */
export function getLineHeight(el: HTMLElement): number {
  const lh = computedStyle(el, "line-height");

  let lineHeight: number;
  if (lh === "normal") {
    if (el.parentNode && el.ownerDocument) {
      const temp = el.ownerDocument.createElement(el.nodeName);
      temp.style.paddingTop = computedStyle(el, "padding-top");
      temp.style.paddingBottom = computedStyle(el, "padding-bottom");
      temp.style.fontSize = computedStyle(el, "font-size");
      temp.style.fontFamily = computedStyle(el, "font-family");
      temp.style.visibility = "hidden";
      temp.style.position = "absolute";

      temp.innerText = "foobar";

      el.parentNode.appendChild(temp);
      lineHeight = temp.clientHeight;

      el.parentNode.removeChild(temp);
    } else {
      const fts = computedStyle(el, "font-size");

      // Normal line heights vary from browser to browser. The spec recommends
      // a value between 1.0 and 1.2 of the font size. Using 1.1 to split the diff.
      lineHeight = parseFloat(fts) * 1.2;
    }
  } else {
    lineHeight = parseFloat(lh);
  }

  return Math.ceil(lineHeight);
}

/**
 * Returns the vertical padding of an element
 *
 * @param el
 */
export function getVerticalPadding(el: HTMLElement): number {
  const pdt = computedStyle(el, "padding-top");
  const pdb = computedStyle(el, "padding-bottom");

  return Math.ceil(parseFloat(pdt) + parseFloat(pdb));
}

/**
 * Returns the maximum height a given element should have based on the line-
 * height of the text and the given clamp value.
 *
 * @param el The element to compute
 * @param height Height of the element
 */
export function getMaxLines(el: HTMLElement, height?: number): number {
  const availHeight = height ?? el.clientHeight;
  const verticalPadding = getVerticalPadding(el);

  const lineHeight = getLineHeight(el);

  return Math.max(Math.floor((availHeight - verticalPadding) / lineHeight), 0);
}

/**
 * Returns the maximum height a given element should have based on the line-
 * height of the text and the given clamp value.
 *
 * @param el The element to compute
 * @param clamp The clamp lines
 */
export function getMaxHeight(el: HTMLElement, clamp: number): number {
  const lineHeight = getLineHeight(el);

  const verticalPadding = getVerticalPadding(el);

  return lineHeight * clamp + verticalPadding;
}

/**
 * Gets an element's last child. That may be another node or a node's contents.
 *
 * @param el The element to get lastChild
 */
export function getLastChild(el: Node): Node | null {
  const lastChild = el.lastChild;

  if (!lastChild) return null;

  if (lastChild.childNodes.length > 0) {
    return getLastChild(lastChild);
  }

  // This is the last child we want, return it
  return lastChild;
}
