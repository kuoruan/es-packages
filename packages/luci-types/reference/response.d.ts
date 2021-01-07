declare namespace LuCI {
  /**
   * The `Response` class is an internal utility class representing HTTP
   * responses.
   */
  class response extends LuCI.baseclass {
    /**
     * The total duration of the HTTP request in milliseconds
     */
    duration: number;

    /**
     * The HTTP headers of the response
     */
    headers: LuCI.headers;

    /**
     * Describes whether the response is successful (status codes `200..299`) or
     * not
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
     * Clones the given response object, optionally overriding the content of
     * the cloned instance.
     *
     * @param content - Override the content of the cloned response. Object
     * values will be treated as JSON response data, all other types will be
     * converted using `String()` and treated as response text.
     *
     * @returns The cloned `Response` instance.
     */
    clone(content?: any): LuCI.response;

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
}
