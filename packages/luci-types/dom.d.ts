export as namespace dom;
export = dom;

declare namespace dom {
  /**
   * Appends the given children data to the given node.
   *
   * @param node - The `Node` argument to append the children to.
   * @param children - The childrens to append to the given node.
   * - When `children` is an array, then each item of the array will be either appended as child element or text node, depending on whether the item is a DOM `Node` instance or some other non-`null` value. Non-`Node`, non-`null` values will be converted to strings first before being passed as argument to `createTextNode()`.
   * - When `children` is a function, it will be invoked with the passed `node` argument as sole parameter and the `append` function will be invoked again, with the given `node` argument as first and the return value of the `children` function as second parameter.
   * - When `children` is is a DOM `Node` instance, it will be appended to the given `node`.
   * - When `children` is any other non-`null` value, it will be converted to a string and appened to the `innerHTML` property of the given `node`.
   *
   * @returns Returns the last children `Node` appended to the node or `null` if either the `node` argument was no valid DOM `node` or if the `children` was `null` or didn't result in further DOM nodes.
   */
  function append(node: Node, children?: any): Node | null;

  /**
   * Sets attributes or registers event listeners on element nodes.
   *
   * @param node - The `Node` argument to set the attributes or add the event listeners for. When the given `node` value is not a valid DOM `Node`, the function returns and does nothing.
   * @param key - Specifies either the attribute or event handler name to use, or an object containing multiple key, value pairs which are each added to the node as either attribute or event handler, depending on the respective value.
   * @param val - Specifies the attribute value or event handler function to add. If the `key` parameter is an `Object`, this parameter will be ignored.
   * - When `val` is of type function, it will be registered as event handler on the given `node` with the `key` parameter being the event name.
   * - When `val` is of type object, it will be serialized as JSON and added as attribute to the given `node`, using the given `key` as attribute name.
   * - When `val` is of any other type, it will be added as attribute to the given `node` as-is, with the underlying `setAttribute()` call implicitely turning it into a string.
   */
  function attr(
    node: Node,
    key: string | { [key: string]: any },
    val?: any
  ): void;

  /**
   * Binds the given class instance ot the specified DOM `Node`.
   *
   * This function uses the `dom.data()` facility to attach the passed instance of a Class to a node. This is needed for complex widget elements or similar where the corresponding class instance responsible for the element must be retrieved from DOM nodes obtained by `querySelector()` or similar means.
   *
   * @param node - The DOM `Node` instance to bind the class to.
   * @param inst - The Class instance to bind to the node.
   *
   * @throws Throws a {@link TypeError} when the given instance argument isn't a valid Class instance.
   *
   * @returns Returns the bound class instance.
   */
  function bindClassInstance<T>(node: Node, inst: T): T;

  /**
   * Finds a bound class instance on the given node itself or the first bound instance on its closest parent node and invokes the specified method name on the found class instance.
   *
   * @param node - The DOM `Node` instance to start from.
   * @param method - The name of the method to invoke on the found class instance.
   * @param params - repeatable. Additional arguments to pass to the invoked method as-is.
   *
   * @returns Returns the return value of the invoked method if a class instance and method has been found. Returns `null` if either no bound class instance could be found, or if the found instance didn't have the requested `method`.
   */
  function callClassMethod<T>(
    node: Node,
    method: string,
    ...params: any[]
  ): T | null;

  /**
   * Replaces the content of the given node with the given children.
   *
   * This function first removes any children of the given DOM Node and then adds the given given children following the rules outlined below.
   *
   * @param node - The `Node` argument to replace the children of.
   * @param children - The childrens to replace into the given node.
   * - When `children` is an array, then each item of the array will be either appended as child element or text node, depending on whether the item is a DOM `Node` instance or some other non-`null` value. Non-`Node`, non-`null` values will be converted to strings first before being passed as argument to `createTextNode()`.
   * - When `children` is a function, it will be invoked with the passed `node` argument as sole parameter and the `append` function will be invoked again, with the given `node` argument as first and the return value of the `children` function as second parameter.
   * - When `children` is is a DOM `Node` instance, it will be appended to the given `node`.
   * - When `children` is any other non-`null` value, it will be converted to a string and appened to the `innerHTML` property of the given `node`.
   *
   * @returns Returns the last children `Node` appended to the node or `null` if either the `node` argument was no valid DOM `node` or if the `children` was `null` or didn't result in further DOM nodes.
   */
  function content(node: Node, children?: any): Node | null;

  function create<T extends Node, E extends Node = Node>(
    html: E | E[] | string,
    attr?: { [key: string]: any },
    data?: any
  ): T;

  function data<T = any>(node: Node, key?: string | null, val?: any): T | null;

  function elem(e: any): boolean;

  function findClassInstance<T>(node: Node): T | null;

  function isEmpty(node: Node, ignoreFn: ignoreCallbackFn): boolean;

  type ignoreCallbackFn = (node: Node) => boolean;
}
