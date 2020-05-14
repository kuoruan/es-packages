// Type definitions for LuCI.rpc
// Documentation: http://openwrt.github.io/luci/jsapi/LuCI.rpc.html
// Definitions by: Xingwang Liao <https://github.com/kuoruan>
// TypeScript Version: 3.8

export as namespace rpc;
export = rpc;

/**
 * The `LuCI.rpc` class provides high level ubus JSON-RPC abstractions and means for listing and invoking remove RPC methods.
 */
declare namespace rpc {
  /**
   * Registers a new interceptor function.
   *
   * @param interceptorFn - The inteceptor function to register.
   *
   * @returns Returns the given function value.
   */
  function addInterceptor<T = any>(
    interceptorFn: interceptorFn<T>
  ): interceptorFn<T>;

  /**
   * Describes a remote RPC call procedure and returns a function implementing it.
   *
   * @param options - If any object names are given, this function will return the method signatures of each given object.
   *
   * @returns Returns a new function implementing the method call described in `options`.
   */
  function declare<T = any>(options: DeclareOptions): invokeFn<T>;

  /**
   * Returns the current RPC base URL.
   *
   * @returns Returns the RPC URL endpoint to issue requests against.
   */
  function getBaseURL(): string;

  /**
   * Returns the current RPC session id.
   *
   * @returns Returns the 32 byte session ID string used for authenticating remote requests.
   */
  function getSessionID(): string;

  /**
   * Translates a numeric `ubus` error code into a human readable description.
   *
   * @param statusCode - The numeric status code.
   *
   * @returns Returns the textual description of the code.
   */
  function getStatusText(statusCode: number): string;

  /**
   * Lists available remote ubus objects or the method signatures of specific objects.
   *
   * This function has two signatures and is sensitive to the number of arguments passed to it:
   * - `list()` - Returns an array containing the names of all remote `ubus` objects
   * - `list("objname", ...)` Returns method signatures for each given `ubus` object name.
   *
   * @param objectNames - repeatable. If any object names are given, this function will return the method signatures of each given object.
   */
  function list(
    ...objectNames: string[]
  ): Promise<
    string[] | { [key: string]: { [key: string]: { [key: string]: string } } }
  >;

  /**
   * Removes a registered interceptor function.
   *
   * @param interceptorFn - The inteceptor function to remove.
   *
   * @returns Returns `true` if the given function has been removed or `false` if it has not been found.
   */
  function removeInterceptor<T = any>(interceptorFn: interceptorFn<T>): boolean;

  /**
   * Set the RPC base URL to use.
   *
   * @param sid - Sets the RPC URL endpoint to issue requests against.
   */
  function setBaseURL(sid: string): void;

  /**
   * Set the RPC session id to use.
   *
   * @param sid - Sets the 32 byte session ID string used for authenticating remote requests.
   */
  function setSessionID(sid: string): void;

  type DeclareOptions = {
    /**
     * The name of the remote `ubus` object to invoke.
     */
    object: string;

    /**
     * The name of the remote `ubus` method to invoke.
     */
    method: string;

    /**
     * Lists the named parameters expected by the remote `ubus` RPC method. The arguments passed to the resulting generated method call function will be mapped to named parameters in the order they appear in this array.
     *
     * Extraneous parameters passed to the generated function will not be sent to the remote procedure but are passed to the `filter function` if one is specified.
     *
     * Examples:
     * - `params: [ "foo", "bar" ]` - When the resulting call function is invoked with `fn(true, false)`, the corresponding args object sent to the remote procedure will be `{ foo: true, bar: false }`.
     * - `params: [ "test" ], filter: function(reply, args, extra) { ... }` - When the resultung generated function is invoked with `fn("foo", "bar", "baz")` then `{ "test": "foo" }` will be sent as argument to the remote procedure and the filter function will be invoked with `filterFn(reply, [ "foo" ], "bar", "baz")`
     */
    params?: string[];

    /**
     * Describes the expected return data structure. The given object is supposed to contain a single key selecting the value to use from the returned `ubus` reply object. The value of the sole key within the `expect` object is used to infer the expected type of the received `ubus` reply data.
     *
     * If the received data does not contain `expect`'s key, or if the type of the data differs from the type of the value in the expect object, the expect object's value is returned as default instead.
     *
     * The key in the `expect` object may be an empty string (`''`) in which case the entire reply object is selected instead of one of its subkeys.
     *
     * If the `expect` option is omitted, the received reply will be returned as-is, regardless of its format or type.
     *
     * Examples:
     * - `expect: { '': { error: 'Invalid response' } }` - This requires the entire `ubus` reply to be a plain JavaScript object. If the reply isn't an object but e.g. an array or a numeric error code instead, it will get replaced with `{ error: 'Invalid response' }` instead.
     * - `expect: { results: [] } `- This requires the received `ubus` reply to be an object containing a key `results` with an array as value. If the received reply does not contain such a key, or if `reply.results` points to a non-array value, the empty array (`[]`) will be used instead.
     * - `expect: { success: false }` - This requires the received `ubus` reply to be an object containing a key `success` with a boolean value. If the reply does not contain `success` or if `reply.success` is not a boolean value, `false` will be returned as default instead.
     */
    expect?: { [key: string]: any };

    /**
     * Specfies an optional filter function which is invoked to transform the received reply data before it is returned to the caller.
     */
    filter?: filterFn;

    /**
     * If set to `true`, non-zero ubus call status codes are treated as fatal error and lead to the rejection of the call promise. The default behaviour is to resolve with the call return code value instead.
     *
     * @defaultValue false
     */
    reject?: boolean;
  };

  /**
   * The filter function is invoked to transform a received `ubus` RPC call reply before returning it to the caller.
   *
   * @param data - The received `ubus` reply data or a subset of it as described in the `expect` option of the RPC call declaration. In case of remote call errors, `data` is numeric `ubus` error code instead.
   * @param args - The arguments the RPC method has been invoked with.
   * @param extraArgs - repeatable. All extraneous arguments passed to the RPC method exceeding the number of arguments describes in the RPC call declaration.
   *
   * @returns The return value of the filter function will be returned to the caller of the RPC method as-is.
   */
  type filterFn = (data: any, args: any[], ...extraArgs: any[]) => any;

  /**
   * Registered interceptor functions are invoked before the standard reply parsing and handling logic.
   *
   * By returning rejected promises, interceptor functions can cause the invocation function to fail, regardless of the received reply.
   *
   * Interceptors may also modify their message argument in-place to rewrite received replies before they're processed by the standard response handling code.
   *
   * A common use case for such functions is to detect failing RPC replies due to expired authentication in order to trigger a new login.
   *
   * @param msg - The unprocessed, JSON decoded remote RPC method call reply.
   *
   * Since interceptors run before the standard parsing logic, the reply data is not verified for correctness or filtered according to `expect` and `filter` specifications in the declarations.
   * @param req - The related request object which is an extended variant of the declaration object, allowing access to internals of the invocation function such as `filter`, `expect` or `params` values.
   *
   * @returns Interceptor functions may return a promise to defer response processing until some delayed work completed. Any values the returned promise resolves to are ignored. When the returned promise rejects with an error, the invocation function will fail too, forwarding the error to the caller.
   */
  type interceptorFn<T> = (msg: any, req: object) => T | Promise<T>;

  /**
   * The generated invocation function is returned by `rpc.declare()` and encapsulates a single RPC method call.
   *
   * Calling this function will execute a remote `ubus` HTTP call request using the arguments passed to it as arguments and return a promise resolving to the received reply values.
   *
   * @param params - repeatable. The parameters to pass to the remote procedure call. The given positional arguments will be named to named RPC parameters according to the names specified in the `params` array of the method declaration.
   *
   * Any additional parameters exceeding the amount of arguments in the `params` declaration are passed as private extra arguments to the declared filter function.
   *
   * @returns Returns a promise resolving to the result data of the remote `ubus` RPC method invocation, optionally substituted and filtered according to the `expect` and `filter` declarations.
   */
  type invokeFn<T> = (...params: any[]) => Promise<T>;
}
