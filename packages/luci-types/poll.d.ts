// Type definitions for LuCI.poll
// Documentation: http://openwrt.github.io/luci/jsapi/LuCI.poll.html
// Definitions by: Xingwang Liao <https://github.com/kuoruan>
// TypeScript Version: 3.8

export as namespace poll;
export = poll;

/**
 * The `Poll` class allows registering and unregistering poll actions, as well as starting, stopping and querying the state of the polling loop.
 */
declare namespace poll {
  /**
   * Test whether the polling loop is running.
   *
   * @returns Returns `true` if polling is active, else `false`.
   */
  function active(): boolean;

  /**
   * Add a new operation to the polling loop. If the polling loop is not already started at this point, it will be implicitely started.
   *
   * @param fn - The function to invoke on each poll interval.
   * @param interval - The poll interval in seconds.
   *
   * @throws Throws {@link TypeError} when an invalid interval was passed.
   *
   * @returns Returns `true` if the function has been added or `false` if it already is registered.
   */
  function add(fn: Function, interval: number): boolean;

  /**
   * Remove an operation from the polling loop. If no further operatons are registered, the polling loop is implicitely stopped.
   *
   * @param fn - The function to remove.
   *
   * @throws Throws {@link TypeError} when the given argument isn't a function.
   *
   * @returns Returns `true` if the function has been removed or `false` if it wasn't found.
   */
  function remove(fn: Function): boolean;

  /**
   * (Re)start the polling loop. Dispatches a custom `poll-start` event to the `document` object upon successful start.
   *
   * @returns Returns `true` if polling has been started (or if no functions where registered) or `false` when the polling loop already runs.
   */
  function start(): boolean;

  /**
   * Stop the polling loop. Dispatches a custom `poll-stop` event to the `document` object upon successful stop.
   *
   * @returns Returns `true` if polling has been stopped or `false` if it din't run to begin with.
   */
  function stop(): boolean;
}
