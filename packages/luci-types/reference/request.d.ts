declare namespace LuCI {
  class request extends LuCI.baseclass {
    /**
     * Register an HTTP response interceptor function. Interceptor functions are
     * useful to perform default actions on incoming HTTP responses, such as
     * checking for expired authentication or for implementing request retries
     * before returning a failure.
     *
     * @param interceptorFn - The interceptor function to register.
     *
     * @returns The registered function.
     */
    addInterceptor(interceptorFn: LuCI.request.interceptorFn): void;

    /**
     * Turn the given relative URL into an absolute URL if necessary.
     *
     * @param url - The URL to convert.
     *
     * @returns The absolute URL derived from the given one, or the original URL
     * if it already was absolute.
     */
    expandURL(url: string): string;

    /**
     * Initiate an HTTP GET request to the given target.
     *
     * @param target - The URL to request.
     * @param options - Additional options to configure the request.
     *
     * @returns The resulting HTTP response.
     */
    get(target: string, options?: LuCI.request.RequestOptions): LuCI.response;

    /**
     * Initiate an HTTP POST request to the given target.
     *
     * @param target - The URL to request.
     * @param data - The request data to send, see `LuCI.request.RequestOptions`
     * for details.
     * @param options - Additional options to configure the request.
     *
     * @returns The resulting HTTP response.
     */
    post(
      target: string,
      data?: any,
      options?: LuCI.request.RequestOptions
    ): LuCI.response;

    /**
     * Remove an HTTP response interceptor function. The passed function value
     * must be the very same value that was used to register the function.
     *
     * @param interceptorFn - The interceptor function to remove.
     *
     * @returns Returns `true` if any function has been removed, else `false`.
     */
    removeInterceptor(interceptorFn: LuCI.request.interceptorFn): boolean;

    /**
     * Initiate an HTTP request to the given target.
     *
     * @param target - The URL to request.
     * @param options - Additional options to configure the request.
     *
     * @returns The resulting HTTP response.
     */
    request(
      target: string,
      options?: LuCI.request.RequestOptions
    ): LuCI.response;
  }

  namespace request {
    /**
     * Interceptor functions are invoked whenever an HTTP reply is received, in
     * the order these functions have been registered.
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
       * Query string data to append to the URL. Non-string values of the given
       * object will be converted to JSON.
       */
      query?: Record<string, unknown>;

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
       * Overrides the request response type. Valid values or `text` to interpret
       * the response as UTF-8 string or `blob` to handle the response as binary
       * `Blob` data.
       *
       * @defaultValue text
       */
      responseType: string;

      /**
       * Specifies the HTTP message body to send along with the request. If the
       * value is a function, it is invoked and the return value used as content,
       * if it is a FormData instance, it is used as-is, if it is an object, it
       * will be converted to JSON, in all other cases it is converted to a
       * string.
       */
      content?: any;

      /**
       * Specifies HTTP headers to set for the request.
       */
      header?: Record<string, string>;

      /**
       * An optional request callback function which receives ProgressEvent
       * instances as sole argument during the HTTP request transfer.
       */
      progress?: () => void;
    };
  }
}
