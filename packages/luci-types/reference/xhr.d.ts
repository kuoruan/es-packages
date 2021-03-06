/**
 * The `LuCI.xhr` class is a legacy compatibility shim for the functionality
 * formerly provided by `xhr.js`. It is registered as global `window.XHR` symbol
 * for compatibility with legacy code.
 *
 * @deprecated New code should use `LuCI.request` instead to implement HTTP
 * request handling.
 */
declare class XHR {
  /**
   * Ignored for backwards compatibility.
   *
   * This function does nothing.
   *
   * @deprecated Do not use.
   */
  abort(): void;

  /**
   * Checks the running state of the request.
   *
   * @deprecated Do not use.
   */
  busy(): boolean;

  /**
   * Cancels a running request.
   *
   * This function does not actually cancel the underlying `XMLHTTPRequest`
   * request but it sets a flag which prevents the invocation of the callback
   * function when the request eventually finishes or timed out.
   *
   * @deprecated Do not use.
   */
  cancel(): void;

  /**
   * This function is a legacy wrapper around `LuCI.get()`.
   *
   * @param url - The URL to request
   * @param data - Additional query string data
   * @param callback - Callback function to invoke on completion
   * @param timeout - Request timeout to use
   *
   * @returns Returns a promise resolving to `null` when concluded.
   *
   * @deprecated Use `LuCI.request.get()`
   */
  get(
    url: string,
    data?: Record<string, unknown>,
    callback?: LuCI.requestCallbackFn,
    timeout?: number
  ): Promise<null>;

  /**
   * This function is a legacy wrapper around `LuCI.post()`.
   *
   * @param url - The URL to request
   * @param data - Additional data to append to the request body.
   * @param callback - Callback function to invoke on completion
   * @param timeout - Request timeout to use
   *
   * @returns Returns a promise resolving to `null` when concluded.
   *
   * @deprecated Use `LuCI.request.post()`
   */
  post(
    url: string,
    data?: Record<string, unknown>,
    callback?: LuCI.requestCallbackFn,
    timeout?: number
  ): Promise<null>;

  /**
   * Existing for backwards compatibility.
   *
   * This function simply throws an `InternalError` when invoked.
   *
   * @throws Throws an {@link InternalError} with the message `Not implemented`
   * when invoked.
   *
   * @deprecated Do not use.
   */
  send_form(): void;
}

declare namespace XHR {
  /**
   * {@inheritDoc LuCI.get}
   */
  const get: typeof LuCI.prototype.get;

  /**
   * {@inheritDoc LuCI.post}
   */
  const post: typeof LuCI.prototype.post;

  /**
   * {@inheritDoc LuCI.poll}
   */
  const poll: typeof LuCI.prototype.poll;

  /**
   * {@inheritDoc Request.poll.stop}
   */
  const stop: typeof LuCI.prototype.Poll.stop;

  /**
   * {@inheritDoc Request.poll.stop}
   */
  const halt: typeof LuCI.prototype.Poll.stop;

  /**
   *
   * {@inheritDoc Request.poll.start}
   */
  const run: typeof LuCI.prototype.Poll.start;

  /**
   * {@inheritDoc Request.poll.active}
   */
  const running: typeof LuCI.prototype.Poll.active;
}

declare namespace LuCI {
  /**
   * @deprecated
   */
  class xhr extends XHR {}
}
