// Type definitions for LuCI
// Documentation: http://openwrt.github.io/luci/jsapi/LuCI.html
// Definitions by: Xingwang Liao <https://github.com/kuoruan>
// TypeScript Version: 3.8

import BC from "./baseclass";
import D from "./dom";
import F from "./form";
import FS from "./fs";
import N from "./network";
import P from "./poll";
import R from "./request";
import RPC from "./rpc";
import S from "./session";
import UCI from "./uci";
import U from "./ui";
import V from "./view";
import XHR from "./xhr";
import VA from "./validation";

export as namespace LuCI;
export = LuCI;

/**
 * This is the LuCI base class. It is automatically instantiated and accessible using the global `L` variable.
 */
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

  /**
   * The `env` object holds environment settings used by LuCI, such as request timeouts, base URLs etc.
   */
  env: {
    base_url: string;
    cgi_base: string;
    documentroot: string;
    media: string;
    nodespec: {
      readonly: boolean;
      satisfied: boolean;
    };
    pollinterval: number;
    requestpath: string;
    resource_version: string;
    resource: string;
    scriptname: string;
    sessionid: string;
    token: string;
    ubuspath: string;
  };

  /**
   * Legacy `L.Poll` class alias.
   *
   * @deprecated New view code should use `'require poll'`; to request the `LuCI.poll` class.
   */
  Poll: typeof LuCI.poll;

  /**
   * Legacy `L.Request` class alias.
   *
   * @deprecated New view code should use `'require request'`; to request the `LuCI.request` class.
   */
  Request: typeof LuCI.request;

  /**
   * Legacy `L.view` class alias.
   *
   * @deprecated New view code should use `'require view'`; to request the `LuCI.view` class.
   */
  view: typeof LuCI.view;

  /**
   * Return a bound function using the given `self` as `this` context and any further arguments as parameters to the bound function.
   *
   * @param fn - The function to bind.
   * @param self - The value to bind as `this` context to the specified function.
   * @param args - repeatable. Zero or more variable arguments which are bound to the function as parameters.
   *
   * @returns Returns the bound function.
   */
  bind(fn: Function, self: any, ...args: any[]): Function;

  /**
   * A wrapper around `raise()` which also renders the error either as modal overlay when `ui.js` is already loaed or directly into the view body.
   *
   * @param type - Either a string specifying the type of the error to throw or an existing `Error` instance to copy.
   * @param fmt - A format string which is used to form the error message, together with all subsequent optional arguments.
   * @param args - repeatable. Zero or more variable arguments to the supplied format string.
   *
   * @throws Throws the created error object with the captured stack trace appended to the message and the type set to the given type argument or copied from the given error instance.
   */
  error(type?: Error | string, fmt?: string, ...args: any[]): void;

  /**
   * Construct an absolute filesystem path relative to the server document root.
   *
   * @param parts - repeatable. An array of parts to join into a path.
   *
   * @returns Return the joined path.
   */
  fspath(...parts: string[]): string;

  /**
   * Issues a GET request to the given url and invokes the specified callback function. The function is a wrapper around `Request.request()`.
   *
   * @param url - The URL to request.
   * @param args - Additional query string arguments to append to the URL.
   * @param cb - The callback function to invoke when the request finishes.
   *
   * @returns Returns a promise resolving to `null` when concluded.
   *
   * @deprecated Use `LuCI.request.get()`.
   */
  get(
    url: string,
    args?: { [key: string]: string },
    cb?: LuCI.requestCallbackFn
  ): Promise<null>;
  get(url: string, cb?: LuCI.requestCallbackFn): Promise<null>;

  /**
   * Deprecated wrapper around `Poll.stop()`.
   *
   * @returns Returns `true` when the polling loop has been stopped or `false` when it didn't run to begin with.
   *
   * @deprecated Use `LuCI.poll.stop()`.
   */
  halt(): boolean;

  /**
   * Test whether a particular system feature is available, such as hostapd SAE support or an installed firewall. The features are queried once at the beginning of the LuCI session and cached in `SessionStorage` throughout the lifetime of the associated tab or browser window.
   *
   * @param feature - The feature to test. For detailed list of known feature flags, see `/modules/luci-base/root/usr/libexec/rpcd/luci`.
   * @param subfeature - Some feature classes like `hostapd` provide sub-feature flags, such as `sae` or `11w` support. The `subfeature` argument can be used to query these.
   *
   * @returns Return `true` if the queried feature (and sub-feature) is available or `false` if the requested feature isn't present or known. Return `null` when a sub-feature was queried for a feature which has no sub-features.
   */
  hasSystemFeature(feature: string, subfeature?: string): boolean | null;

  /**
   * Check whether a view has sufficient permissions.
   *
   * @returns Returns `null` if the current session has no permission at all to load resources required by the view. Returns `false` if readonly permissions are granted or `true` if at least one required ACL group is granted with write permissions.
   */
  hasViewPermission(): boolean | null;

  /**
   * Tests whether the passed argument is a JavaScript object. This function is meant to be an object counterpart to the standard `Array.isArray()` function.
   *
   * @param val - The value to test
   *
   * @returns Returns `true` if the given value is of type object and not `null`, else returns `false`.
   */
  isObject(val?: any): boolean;

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
   * Issues a POST request to the given url and invokes the specified callback function. The function is a wrapper around `Request.request()`. The request is sent using `application/x-www-form-urlencoded` encoding and will contain a field `token` with the current value of `LuCI.env.token` by default.
   *
   * @param url - The URL to request.
   * @param args - Additional post arguments to append to the request body.
   * @param cb - The callback function to invoke when the request finishes.
   *
   * @returns Returns a promise resolving to null when concluded.
   *
   * @deprecated Use `LuCI.request.post()`
   */
  post(
    url: string,
    args?: { [key: string]: string },
    cb?: LuCI.requestCallbackFn
  ): Promise<null>;
  post(url: string, cb?: LuCI.requestCallbackFn): Promise<null>;

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
   * @throws Throws {@link DependencyError} when the class to load includes circular dependencies.
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
  /**
   * The request callback function is invoked whenever an HTTP reply to a request made using the `L.get()`, `L.post()` or `L.poll()` function is timed out or received successfully.
   *
   * @param xhr - The XMLHTTPRequest instance used to make the request.
   * @param data - The response JSON if the response could be parsed as such, else `null`.
   * @param duration - The total duration of the request in milliseconds.
   */
  type requestCallbackFn = (
    xhr: XMLHttpRequest,
    data: any,
    duration: number
  ) => void;

  /**
   * The `Headers` class is an internal utility class exposed in HTTP response objects using the `response.headers` property.
   */
  class headers extends BC {
    /**
     * Returns the value of the given header name. Note: Header-Names are case-insensitive.
     *
     * @param name - The header name to read
     *
     * @returns The value of the given header name or `null` if the header isn't present.
     */
    get(name: string): string | null;

    /**
     * Checks whether the given header name is present.
     *
     * @remarks Header-Names are case-insensitive.
     *
     * @param name - The header name to check
     *
     * @returns Returns `true` if the header name is present, `false` otherwise
     */
    has(name: string): boolean;
  }

  /**
   * The `Response` class is an internal utility class representing HTTP responses.
   */
  class response extends BC {
    /**
     * The total duration of the HTTP request in milliseconds
     */
    duration: number;

    /**
     * The HTTP headers of the response
     */
    headers: headers;

    /**
     * Describes whether the response is successful (status codes `200..299`) or not
     */
    ok: boolean;

    /**
     * The numeric HTTP status code of the response
     */
    status: number;

    /**
     * The HTTP status description message of the response
     */
    statusText: string;

    /**
     * The final URL of the request, i.e. after following redirects.
     */
    url: string;

    /**
     * Access the response content as blob.
     *
     * @returns The response content as blob.
     */
    blob(): Blob;

    /**
     * Clones the given response object, optionally overriding the content of the cloned instance.
     *
     * @param content - Override the content of the cloned response. Object values will be treated as JSON response data, all other types will be converted using `String()` and treated as response text.
     *
     * @returns The cloned `Response` instance.
     */
    clone(content?: any): response;

    /**
     * Access the response content as JSON data.
     *
     * @throws Throws `SyntaxError` if the content isn't valid JSON.
     *
     * @returns The parsed JSON data.
     */
    json(): any;

    /**
     * Access the response content as string.
     *
     * @returns The response content.
     */
    text(): string;
  }

  export import baseclass = BC;
  export import dom = D;
  export import form = F;
  export import fs = FS;
  export import network = N;
  export import poll = P;
  export import request = R;
  export import rpc = RPC;
  export import session = S;
  export import uci = UCI;
  export import ui = U;
  export import validation = VA;
  export import view = V;
  export import xhr = XHR;

  /**
   * Alias for baseclass
   */
  export import Class = BC;
}
