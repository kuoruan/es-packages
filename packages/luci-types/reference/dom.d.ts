declare namespace LuCI {
  /**
   * The `dom` class provides convenience method for creating and manipulating DOM
   * elements.
   *
   * To import the class in views, use `'require dom'`, to import it in external
   * JavaScript, use `L.require("dom").then(...)`.
   */
  class dom extends LuCI.baseclass {
    /**
     * Appends the given children data to the given node.
     *
     * @param node - The `Node` argument to append the children to.
     * @param children - The childrens to append to the given node.
     * - When `children` is an array, then each item of the array will be either
     *   appended as child element or text node, depending on whether the item is
     *   a DOM `Node` instance or some other non-`null` value. Non-`Node`,
     *   non-`null` values will be converted to strings first before being passed
     *   as argument to `createTextNode()`.
     * - When `children` is a function, it will be invoked with the passed `node`
     *   argument as sole parameter and the `append` function will be invoked
     *   again, with the given `node` argument as first and the return value of
     *   the `children` function as second parameter.
     * - When `children` is is a DOM `Node` instance, it will be appended to the
     *   given `node`.
     * - When `children` is any other non-`null` value, it will be converted to a
     *   string and appened to the `innerHTML` property of the given `node`.
     *
     * @returns Returns the last children `Node` appended to the node or `null` if
     * either the `node` argument was no valid DOM `node` or if the `children` was
     * `null` or didn't result in further DOM nodes.
     */
    append(node: Node, children?: any): Node | null;

    /**
     * Sets attributes or registers event listeners on element nodes.
     *
     * @param node - The `Node` argument to set the attributes or add the event
     * listeners for. When the given `node` value is not a valid DOM `Node`, the
     * function returns and does nothing.
     * @param key - Specifies either the attribute or event handler name to use,
     * or an object containing multiple key, value pairs which are each added to
     * the node as either attribute or event handler, depending on the respective
     * value.
     * @param val - Specifies the attribute value or event handler function to
     * add. If the `key` parameter is an `Object`, this parameter will be ignored.
     * - When `val` is of type function, it will be registered as event handler on
     *   the given `node` with the `key` parameter being the event name.
     * - When `val` is of type object, it will be serialized as JSON and added as
     *   attribute to the given `node`, using the given `key` as attribute name.
     * - When `val` is of any other type, it will be added as attribute to the
     *   given `node` as-is, with the underlying `setAttribute()` call implicitely
     *   turning it into a string.
     */
    attr(node: Node, key: string | { [key: string]: any }, val?: any): void;

    /**
     * Binds the given class instance ot the specified DOM `Node`.
     *
     * This function uses the `dom.data()` facility to attach the passed instance
     * of a Class to a node. This is needed for complex widget elements or similar
     * where the corresponding class instance responsible for the element must be
     * retrieved from DOM nodes obtained by `querySelector()` or similar means.
     *
     * @param node - The DOM `Node` instance to bind the class to.
     * @param inst - The Class instance to bind to the node.
     *
     * @throws Throws a {@link TypeError} when the given instance argument isn't a
     * valid Class instance.
     *
     * @returns Returns the bound class instance.
     */
    bindClassInstance<T>(node: Node, inst: T): T;

    /**
     * Finds a bound class instance on the given node itself or the first bound
     * instance on its closest parent node and invokes the specified method name
     * on the found class instance.
     *
     * @param node - The DOM `Node` instance to start from.
     * @param method - The name of the method to invoke on the found class
     * instance.
     * @param params - repeatable. Additional arguments to pass to the invoked
     * method as-is.
     *
     * @returns Returns the return value of the invoked method if a class instance
     * and method has been found. Returns `null` if either no bound class instance
     * could be found, or if the found instance didn't have the requested
     * `method`.
     */
    callClassMethod<T>(node: Node, method: string, ...params: any[]): T | null;

    /**
     * Replaces the content of the given node with the given children.
     *
     * This function first removes any children of the given DOM Node and then
     * adds the given given children following the rules outlined below.
     *
     * @param node - The `Node` argument to replace the children of.
     * @param children - The childrens to replace into the given node.
     * - When `children` is an array, then each item of the array will be either
     *   appended as child element or text node, depending on whether the item is
     *   a DOM `Node` instance or some other non-`null` value. Non-`Node`,
     *   non-`null` values will be converted to strings first before being passed
     *   as argument to `createTextNode()`.
     * - When `children` is a function, it will be invoked with the passed `node`
     *   argument as sole parameter and the `append` function will be invoked
     *   again, with the given `node` argument as first and the return value of
     *   the `children` function as second parameter.
     * - When `children` is is a DOM `Node` instance, it will be appended to the
     *   given `node`.
     * - When `children` is any other non-`null` value, it will be converted to a
     *   string and appened to the `innerHTML` property of the given `node`.
     *
     * @returns Returns the last children `Node` appended to the node or `null` if
     * either the `node` argument was no valid DOM `node` or if the `children` was
     * `null` or didn't result in further DOM nodes.
     */
    content(node: Node, children?: any): Node | null;

    /**
     * Creates a new DOM `Node` from the given `html`, `attr` and `data`
     * parameters.
     *
     * This function has multiple signatures, it can be either invoked in the form
     * `create(html[, attr[, data]])` or in the form `create(html[, data])`. The
     * used variant is determined from the type of the second argument.
     *
     * @param html - Describes the node to create.
     * - When the value of `html` is of type array, a `DocumentFragment` node is
     *   created and each item of the array is first converted to a DOM `Node` by
     *   passing it through `create()` and then added as child to the fragment.
     * - When the value of `html` is a DOM `Node` instance, no new element will be
     *   created but the node will be used as-is.
     * - When the value of `html` is a string starting with \<, it will be passed
     *   to `dom.parse()` and the resulting value is used.
     * - When the value of `html` is any other string, it will be passed to
     *   `document.createElement()` for creating a new DOM `Node` of the given
     *   name.
     * @param attr - Specifies an Object of key, value pairs to set as attributes
     * or event handlers on the created node. Refer to `dom.attr()` for details.
     * @param data - Specifies children to append to the newly created element.
     * Refer to `dom.append()` for details.
     *
     * @throws Throws an {@link InvalidCharacterError} when the given `html`
     * argument contained malformed markup (such as not escaped `&` characters in
     * XHTML mode) or when the given node name in `html` contains characters which
     * are not legal in DOM element names, such as spaces.
     *
     * @returns Returns the newly created `Node`.
     */
    create<T extends Node = Node>(
      html: Node | Node[] | string,
      attr?: { [key: string]: any },
      data?: any
    ): T;
    create<T extends Node = Node>(html: Node | Node[] | string, data?: any): T;

    /**
     * Attaches or detaches arbitrary data to and from a DOM `Node`.
     *
     * This function is useful to attach non-string values or runtime data that is
     * not serializable to DOM nodes. To decouple data from the DOM, values are
     * not added directly to nodes, but inserted into a registry instead which is
     * then referenced by a string key stored as `data-idref` attribute in the
     * node.
     *
     * This function has multiple signatures and is sensitive to the number of
     * arguments passed to it.
     * - `dom.data(node)` - Fetches all data associated with the given node.
     * - `dom.data(node, key)` - Fetches a specific key associated with the given
     *   node.
     * - `dom.data(node, key, val)` - Sets a specific key to the given value
     *   associated with the given node.
     * - `dom.data(node, null)` - Clears any data associated with the node.
     * - `dom.data(node, key, null)` - Clears the given key associated with the
     *   node.
     *
     * @param node - The DOM `Node` instance to set or retrieve the data for.
     * @param key - This is either a string specifying the key to retrieve, or
     * `null` to unset the entire node data.
     * @param val - This is either a non-`null` value to set for a given key or
     * `null` to remove the given `key` from the specified node.
     *
     * @returns Returns the get or set value, or `null` when no value could be
     * found.
     */
    data<T = string>(node: Node, key?: string | null, val?: any): T | null;

    /**
     * Tests whether the given argument is a valid DOM `Node`.
     *
     * @param e - The value to test.
     *
     * @returns Returns true if the value is a DOM `Node`, else false.
     */
    elem(e: any): boolean;

    /**
     * Finds a bound class instance on the given node itself or the first bound
     * instance on its closest parent node.
     *
     * @param node - The DOM `Node` instance to start from.
     *
     * @returns Returns the founds class instance if any or `null` if no bound
     * class could be found on the node itself or any of its parents.
     */
    findClassInstance<T>(node: Node): T | null;

    /**
     * Tests whether a given DOM `Node` instance is empty or appears empty.
     *
     * Any element child nodes which have the CSS class `hidden` set or for which
     * the optionally passed `ignoreFn` callback function returns `false` are
     * ignored.
     *
     * @param node - The DOM `Node` instance to test.
     * @param ignoreFn - Specifies an optional function which is invoked for each
     * child node to decide whether the child node should be ignored or not.
     *
     * @returns Returns `true` if the node does not have any children or if any
     * children node either has a `hidden` CSS class or a `false` result when
     * testing it using the given `ignoreFn`.
     */
    isEmpty(node: Node, ignoreFn: LuCI.dom.ignoreCallbackFn): boolean;

    /**
     * Tests whether a given `Node` matches the given query selector.
     *
     * This function is a convenience wrapper around the standard
     * `Node.matches("selector")` function with the added benefit that the `node`
     * argument may be a non-`Node` value, in which case this function simply
     * returns `false`.
     *
     * @param node - The `Node` argument to test the selector against.
     * @param selector - The query selector expression to test against the given
     * node.
     *
     * @returns Returns `true` if the given node matches the specified selector or
     * `false` when the node argument is no valid DOM `Node` or the selector
     * didn't match.
     */
    matches(node: Node, selector?: string): boolean;

    /**
     * Returns the closest parent node that matches the given query selector
     * expression.
     *
     * This function is a convenience wrapper around the standard
     * `Node.closest("selector")` function with the added benefit that the `node`
     * argument may be a non-`Node` value, in which case this function simply
     * returns `null`.
     *
     * @param node - The `Node` argument to find the closest parent for.
     * @param selector - The query selector expression to test against each
     * parent.
     *
     * @returns Returns the closest parent node matching the selector or `null`
     * when the node argument is no valid DOM `Node` or the selector didn't match
     * any parent.
     */
    parent(node: Node, selector?: string): Node | null;

    /**
     * Parses a given string as HTML and returns the first child node.
     *
     * @param s - A string containing an HTML fragment to parse. Note that only
     * the first result of the resulting structure is returned, so an input value
     * of `<div>foo</div> <div>bar</div>` will only return the first `div` element
     * node.
     *
     * @returns Returns the first DOM `Node` extracted from the HTML fragment or
     * `null` on parsing failures or if no element could be found.
     */
    parse(s: string): Node;
  }

  namespace dom {
    /**
     * The ignore callback function is invoked by `isEmpty()` for each child node
     * to decide whether to ignore a child node or not.
     *
     * When this function returns `false`, the node passed to it is ignored, else
     * not.
     *
     * @param node - The child node to test.
     *
     * @returns Boolean indicating whether to ignore the node or not.
     */
    type ignoreCallbackFn = (node: Node) => boolean;
  }
}
