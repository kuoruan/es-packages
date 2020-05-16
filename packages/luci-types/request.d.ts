// Type definitions for LuCI.request
// Documentation: http://openwrt.github.io/luci/jsapi/LuCI.request.html
// Definitions by: Xingwang Liao <https://github.com/kuoruan>
// TypeScript Version: 3.8

import P from "./poll";

export as namespace request;
export = request;

/**
 * The `Request` class allows initiating HTTP requests and provides utilities for dealing with responses.
 */
declare namespace request {
  /**
   * Register an HTTP response interceptor function. Interceptor functions are useful to perform default actions on incoming HTTP responses, such as checking for expired authentication or for implementing request retries before returning a failure.
   *
   * @param interceptorFn - The interceptor function to register.
   *
   * @returns The registered function.
   */
  function addInterceptor(interceptorFn: interceptorFn): void;

  /**
   * Turn the given relative URL into an absolute URL if necessary.
   *
   * @param url - The URL to convert.
   *
   * @returns The absolute URL derived from the given one, or the original URL if it already was absolute.
   */
  function expandURL(url: string): string;

  /**
   * Initiate an HTTP GET request to the given target.
   *
   * @param target - The URL to request.
   * @param options - Additional options to configure the request.
   *
   * @returns The resulting HTTP response.
   */
  function get(target: string, options?: RequestOptions): LuCI.response;

  /**
   * Initiate an HTTP POST request to the given target.
   *
   * @param target - The URL to request.
   * @param data - The request data to send, see `LuCI.request.RequestOptions` for details.
   * @param options - Additional options to configure the request.
   *
   * @returns The resulting HTTP response.
   */
  function post(
    target: string,
    data?: any,
    options?: RequestOptions
  ): LuCI.response;

  /**
   * Remove an HTTP response interceptor function. The passed function value must be the very same value that was used to register the function.
   *
   * @param interceptorFn - The interceptor function to remove.
   *
   * @returns Returns `true` if any function has been removed, else `false`.
   */
  function removeInterceptor(interceptorFn: interceptorFn): boolean;

  /**
   * Initiate an HTTP request to the given target.
   *
   * @param target - The URL to request.
   * @param options - Additional options to configure the request.
   *
   * @returns The resulting HTTP response.
   */
  function request(target: string, options?: RequestOptions): LuCI.response;

  /**
   * Interceptor functions are invoked whenever an HTTP reply is received, in the order these functions have been registered.
   *
   * @param res - The HTTP response object
   */
  type interceptorFn = (res: LuCI.response) => void;

  type RequestOptions = {
    /**
     * The HTTP method to use, e.g. `GET` or `POST`.
     *
     * @defaultValue GET
     */
    method?: string;

    /**
     * Query string data to append to the URL. Non-string values of the given object will be converted to JSON.
     */
    query?: { [key: string]: object | string };

    /**
     * Specifies whether the HTTP response may be retrieved from cache.
     *
     * @defaultValue false
     */
    cache?: boolean;

    /**
     * Provides a username for HTTP basic authentication.
     */
    username?: string;

    /**
     * Provides a password for HTTP basic authentication.
     */
    password?: string;

    /**
     * Specifies the request timeout in seconds.
     */
    timeout?: number;

    /**
     * Whether to include credentials such as cookies in the request.
     *
     * @defaultValue false
     */
    credentials?: string;

    /**
     * Overrides the request response type. Valid values or `text` to interpret the response as UTF-8 string or `blob` to handle the response as binary `Blob` data.
     *
     * @defaultValue text
     */
    responseType: string;

    /**
     * Specifies the HTTP message body to send along with the request. If the value is a function, it is invoked and the return value used as content, if it is a FormData instance, it is used as-is, if it is an object, it will be converted to JSON, in all other cases it is converted to a string.
     */
    content?: any;

    /**
     * Specifies HTTP headers to set for the request.
     */
    header?: { [key: string]: string };

    /**
     * An optional request callback function which receives ProgressEvent instances as sole argument during the HTTP request transfer.
     */
    progress?: Function;
  };

  export import poll = P;
}
