// Type definitions for LuCI.session
// Documentation: http://openwrt.github.io/luci/jsapi/LuCI.session.html
// Definitions by: Xingwang Liao <https://github.com/kuoruan>
// TypeScript Version: 3.8

export as namespace session;
export = session;

/**
 * The `session` class provides various session related functionality.
 */
declare namespace session {
  /**
   * Retrieve the current session ID.
   *
   * @returns Returns the current session ID.
   */
  function getID(): string;

  /**
   * Retrieve the current session token.
   *
   * @returns Returns the current session token or `null` if not logged in.
   */
  function getToken(): string | null;

  /**
   * Retrieve data from the local session storage.
   *
   * @param key - The key to retrieve from the session data store. If omitted,
   * all session data will be returned.
   *
   * @returns Returns the stored session data or `null` if the given key wasn't
   * found.
   */
  function getLocalData(key: string): any;

  /**
   * Set data in the local session storage.
   *
   * @param key - The key to set in the session data store.
   * @param value - The value to store. It will be internally converted to JSON
   * before being put in the session store.
   *
   * @returns Returns `true` if the data could be stored or `false` on error.
   */
  function setLocalData(key: string, value: any): boolean;
}
