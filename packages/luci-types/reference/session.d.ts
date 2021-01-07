declare namespace LuCI {
  /**
   * The `session` class provides various session related functionality.
   */
  class session extends LuCI.baseclass {
    /**
     * Retrieve the current session ID.
     *
     * @returns Returns the current session ID.
     */
    getID(): string;

    /**
     * Retrieve data from the local session storage.
     *
     * @param key - The key to retrieve from the session data store. If omitted,
     * all session data will be returned.
     *
     * @returns Returns the stored session data or `null` if the given key wasn't
     * found.
     */
    getLocalData(key?: string): any;

    /**
     * Retrieve the current session token.
     *
     * @returns Returns the current session token or `null` if not logged in.
     */
    getToken(): string | null;

    /**
     * Set data in the local session storage.
     *
     * @param key - The key to set in the session data store.
     * @param value - The value to store. It will be internally converted to JSON
     * before being put in the session store.
     *
     * @returns Returns `true` if the data could be stored or `false` on error.
     */
    setLocalData(key: string, value: any): boolean;
  }
}
