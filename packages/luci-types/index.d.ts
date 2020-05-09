// Type definitions for LuCI2
// Documentation: http://openwrt.github.io/luci/jsapi/index.html
// Definitions by: Xingwang Liao <https://github.com/kuoruan>
// Definitions: https://github.com/kuoruan/es-packages
// TypeScript Version: 3.8

import B from "./baseclass";
import D from "./dom";
import F from "./form";
import FS from "./fs";
import N from "./network";
import U from "./ui";
import V from "./view";

export as namespace LuCI;
export = LuCI;

declare class LuCI {
  constructor(env: object);

  /**
   * Legacy `L.Class` class alias.
   *
   * @deprecated New view code should use `'require baseclass'`; to request the `LuCI.baseclass` class.
   */
  Class: typeof LuCI.baseclass;

  /**
   * Legacy `L.dom` class alias.
   *
   * @deprecated New view code should use `'require dom'`; to request the `LuCI.dom` class.
   */
  dom: typeof LuCI.dom;
  env: object;

  /**
   * Legacy `L.Poll` class alias.
   *
   * @deprecated New view code should use `'require poll'`; to request the `LuCI.poll` class.
   */
  Poll: any;

  /**
   * Legacy `L.Request` class alias.
   *
   * @deprecated New view code should use `'require request'`; to request the `LuCI.request` class.
   */
  Request: any;

  /**
   * Legacy `L.view` class alias.
   *
   * @deprecated New view code should use `'require view'`; to request the `LuCI.view` class.
   */
  view: typeof LuCI.view;
  bind(fn: Function, self: any, ...args: any[]): Function;
  error(type: Error | string, fmt: string, ...args: any[]): void;
  fspath(...parts: string[]): string;

  /**
   * Issues a GET request to the given url and invokes the specified callback function. The function is a wrapper around `Request.request()`.
   *
   * @deprecated Use `LuCI.request`.
   */
  get(
    url: string,
    args: { [key: string]: string },
    cb: LuCI.requestCallbackFn
  ): Promise<null>;

  /**
   * Deprecated wrapper around `Poll.stop()`.
   *
   * @deprecated Use `LuCI.poll.stop()`.
   */
  halt(): boolean;
  hasSystemFeature(feature: string, subfeature?: string): boolean | null;
  hasViewPermission(): boolean | null;
  isObject(val: any): boolean;

  /**
   * Return the complete URL path to the current view.
   *
   * @returns Returns the URL path to the current view.
   */
  location(): string;

  /**
   * Construct an URL path relative to the media resource path of the LuCI ui (usually `/luci-static/$theme_name`).
   *
   * The resulting URL is guaranteed to only contain the characters `a-z`, `A-Z`, `0-9`, `_`, `.`, `%`, `,`, `;`, and `-` as well as `/` for the path separator.
   *
   * @param parts - An array of parts to join into an URL path. Parts may contain slashes and any of the other characters mentioned above.
   *
   * @returns Returns the resulting URL path.
   */
  media(...parts: string[]): string;

  /**
   * Construct a relative URL path from the given prefix and parts. The resulting URL is guaranteed to only contain the characters `a-z`, `A-Z`, `0-9`, `_`, `.`, `%`, `,`, `;`, and `-` as well as `/` for the path separator.
   *
   * @param prefix - The prefix to join the given parts with. If the `prefix` is omitted, it defaults to an empty string.
   * @param parts - An array of parts to join into an URL path. Parts may contain slashes and any of the other characters mentioned above.
   *
   * @returns Return the joined URL path.
   */
  path(prefix: string, ...parts: string[]): string;

  /**
   * Register a polling HTTP request that invokes the specified callback function. The function is a wrapper around `Request.poll.add()`.
   *
   * @param interval - The poll interval to use. If set to a value less than or equal to 0, it will default to the global poll interval configured in `LuCI.env.pollinterval`.
   * @param url - The URL to request.
   * @param args - Specifies additional arguments for the request. For GET requests, the arguments are appended to the URL as query string, for POST requests, they'll be added to the request body.
   * @param cb - The callback function to invoke whenever a request finishes.
   * @param post - When set to `false` or not specified, poll requests will be made using the GET method. When set to `true`, POST requests will be issued. In case of POST requests, the request body will contain an argument `token` with the current value of `LuCI.env.token` by default, regardless of the parameters specified with `args`.
   *
   * @returns Returns the internally created function that has been passed to `Request.poll.add()`. This value can be passed to `Poll.remove()` to remove the polling request.
   *
   * @deprecated Use `LuCI.request.poll.add()`.
   */
  poll(
    interval: number,
    url: string,
    args: object,
    cb: LuCI.requestCallbackFn,
    post: boolean
  ): Function;
  poll(interval: number, url: string, cb: LuCI.requestCallbackFn): Function;

  /**
   * Captures the current stack trace and throws an error of the specified type as a new exception. Also logs the exception as error to the debug console if it is available.
   *
   * @param type - Either a string specifying the type of the error to throw or an existing `Error` instance to copy.
   * @param fmt - A format string which is used to form the error message, together with all subsequent optional arguments.
   * @param args - repeatable. Zero or more variable arguments to the supplied format string.
   *
   * @throws Throws the created error object with the captured stack trace appended to the message and the type set to the given type argument or copied from the given error instance. {@link core-library#Error | Error}
   */
  raise(type?: Error | string, fmt?: string, ...args: any[]): void;

  /**
   * Load an additional LuCI JavaScript class and its dependencies, instantiate it and return the resulting class instance. Each class is only loaded once. Subsequent attempts to load the same class will return the already instantiated class.
   *
   * @param name - The name of the class to load in dotted notation. Dots will be replaced by spaces and joined with the runtime-determined base URL of LuCI.js to form an absolute URL to load the class file from.
   *
   * @throws Throws a {@link DependencyError} when the class to load includes circular dependencies.
   * @throws Throws {@link NetworkError} when the underlying `LuCI.request` call failed.
   * @throws Throws {@link SyntaxError} when the loaded class file code cannot be interpreted by `eval`.
   * @throws Throws {@link TypeError} when the class file could be loaded and interpreted, but when invoking its code did not yield a valid class instance.
   *
   * @returns Returns the instantiated class.
   */
  require<T extends LuCI.baseclass = LuCI.baseclass>(name: string): Promise<T>;

  /**
   * Returns a promise resolving with either the given value or or with the given default in case the input value is a rejecting promise.
   *
   * @param value - The value to resolve the promise with.
   * @param defvalue - The default value to resolve the promise with in case the given input value is a rejecting promise.
   *
   * @returns Returns a new promise resolving either to the given input value or to the given default value on error.
   */
  resolveDefault<T = any>(value: Promise<T>, defvalue?: T): Promise<T>;

  /**
   * Construct an URL path relative to the global static resource path of the LuCI ui (usually `/luci-static/resources`).
   *
   * The resulting URL is guaranteed to only contain the characters `a-z`, `A-Z`, `0-9`, `_`, `.`, `%`, `,`, `;`, and `-` as well as `/` for the path separator.
   *
   * @param parts - An array of parts to join into an URL path. Parts may contain slashes and any of the other characters mentioned above.
   *
   * @returns Returns the resulting URL path.
   */
  resource(...parts: any[]): string;

  /**
   * Deprecated wrapper around `Poll.start()`.
   *
   * @returns Returns true when the polling loop has been started or false when it was already running.
   *
   * @deprecated Use `LuCI.poll.start()`.
   */
  run(): string;

  /**
   * Return an array of sorted object keys, optionally sorted by a different key or a different sorting mode.
   *
   * @param obj - The object to extract the keys from. If the given value is not an object, the function will return an empty array.
   * @param key - Specifies the key to order by. This is mainly useful for nested objects of objects or objects of arrays when sorting shall not be performed by the primary object keys but by some other key pointing to a value within the nested values.
   * @param sortmode - May be either `addr` or `num` to override the natural lexicographic sorting with a sorting suitable for IP/MAC style addresses or numeric values respectively.
   *
   * @returns Returns an array containing the sorted keys of the given object.
   */
  sortedKeys(obj: object, key?: string, sortmode?: string): string[];

  /**
   * Deprecated wrapper around `Poll.remove()`.
   *
   * @param entry - The polling function to remove.
   *
   * @returns Returns `true` when the function has been removed or `false` if it could not be found.
   *
   * @deprecated Use `LuCI.poll.remove()`.
   */
  stop(entry: Function): boolean;

  /**
   * Converts the given value to an array. If the given value is of type array, it is returned as-is, values of type object are returned as one-element array containing the object, empty strings and null values are returned as empty array, all other values are converted using String(), trimmed, split on white space and returned as array.
   *
   * @param val - The value to convert into an array.
   *
   * @returns Returns the resulting array.
   */
  toArray<T>(val: any): T[];

  /**
   * Construct an URL pathrelative to the script path of the server side LuCI application (usually `/cgi-bin/luci`).
   *
   * The resulting URL is guaranteed to only contain the characters `a-z`, `A-Z`, `0-9`, `_`, `.`, `%`, `,`, `;`, and `-` as well as `/` for the path separator.
   *
   * @param parts - An array of parts to join into an URL path. Parts may contain slashes and any of the other characters mentioned above.
   *
   * @returns Returns the resulting URL path.
   */
  url(...parts: string[]): string;
}

declare namespace LuCI {
  type requestCallbackFn = (
    xhr: XMLHttpRequest,
    data: object | null,
    duration: number
  ) => void;

  class headers {
    get(name: string): string | null;
  }

  /**
   * The `LuCI.xhr` class is a legacy compatibility shim for the functionality formerly provided by `xhr.js`. It is registered as global `window.XHR` symbol for compatibility with legacy code.
   *
   * @deprecated New code should use `LuCI.request` instead to implement HTTP request handling.
   */
  class xhr {
    /**
     * Ignored for backwards compatibility.
     *
     * This function does nothing.
     *
     * @deprecated Use `LuCI.request`
     */
    abort(): void;

    /**
     * Checks the running state of the request.
     */
    busy(): boolean;

    /**
     * Cancels a running request.
     *
     * This function does not actually cancel the underlying `XMLHTTPRequest` request but it sets a flag which prevents the invocation of the callback function when the request eventually finishes or timed out.
     */
    cancel(): void;

    get(
      url: string,
      data?: object,
      callback?: requestCallbackFn,
      timeout?: number
    ): Promise<null>;

    post(
      url: string,
      data?: object,
      callback?: requestCallbackFn,
      timeout?: number
    ): Promise<null>;

    send_form(): void;
  }

  class request {}

  namespace request {
    interface poll {}
  }

  export import form = F;
  export import ui = U;
  export import baseclass = B;
  export import view = V;
  export import network = N;
  export import fs = FS;
  export import dom = D;

  export import Class = B;
}

declare global {
  interface String {
    format: (...args: any[]) => string;
  }

  const L: LuCI;
  const E: typeof LuCI.dom.create;
}
