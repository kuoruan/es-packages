declare namespace LuCI {
  /**
   * The `Headers` class is an internal utility class exposed in HTTP response
   * objects using the `response.headers` property.
   */
  class headers extends LuCI.baseclass {
    /**
     * Returns the value of the given header name. Note: Header-Names are
     * case-insensitive.
     *
     * @param name - The header name to read
     *
     * @returns The value of the given header name or `null` if the header isn't
     * present.
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
}
