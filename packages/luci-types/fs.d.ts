// Type definitions for LuCI.fs
// Documentation: http://openwrt.github.io/luci/jsapi/LuCI.fs.html
// Definitions by: Xingwang Liao <https://github.com/kuoruan>
// TypeScript Version: 3.8

export as namespace fs;
export = fs;

/**
 * Provides high level utilities to wrap file system related RPC calls. To import the class in views, use `'require fs'`, to import it in external JavaScript, use `L.require("fs").then(...)`.
 */
declare namespace fs {
  /**
   * Execute the specified command, optionally passing params and environment variables.
   *
   * The key/value pairs in the optional `env` table are translated to `setenv()` calls prior to running the command.
   *
   * @param command - The command to invoke.
   * @param params - The arguments to pass to the command.
   * @param env - Environment variables to set.
   *
   * @returns Returns a promise resolving to an object describing the execution results or rejecting with an error stating the failure reason.
   */
  function exec(
    command: string,
    params?: string[],
    env?: { [key: string]: string }
  ): Promise<FileExecResult>;

  /**
   * Execute the specified command, bypassing ubus.
   *
   * This function will invoke the requested commands through the cgi-io helper applet at `/cgi-bin/cgi-exec` which bypasses the ubus rpc transport. This is useful to fetch large command outputs which might exceed the ubus message size limits or which contain binary data.
   *
   * The cgi-io helper will enforce the same access permission rules as the ubus based exec call.
   *
   * @remarks
   * The `command` must be either the path to an executable, or a basename without arguments in which case it will be searched in $PATH. If specified, the values given in params will be passed as arguments to the command.
   *
   * @param command - The command to invoke.
   * @param params - The arguments to pass to the command.
   * @param type - The expected output type of the invoked program. Valid values are `text` to interpret the output as string, `json` to parse the output as JSON or `blob` to return the output as Blob instance.
   * @param latin1 - Whether to encode the command line as Latin1 instead of UTF-8. This is usually not needed but can be useful for programs that cannot handle UTF-8 input.
   *
   * @returns Returns a promise resolving with the command stdout output interpreted according to the specified type or rejecting with an error stating the failure reason.
   */
  function exec_direct(
    command: string,
    params?: string[],
    type?: string,
    latin1?: boolean
  ): Promise<any>;

  /**
   * Read the contents of the given file, split it into lines, trim leading and trailing white space of each line and return the resulting array.
   *
   * This function is guaranteed to not reject its promises, on failure, an empty array will be returned.
   *
   * @param path - The file path to read.
   *
   * @returns Returns a promise resolving to an array containing the stripped lines of the given file or `[]` on failure.
   */
  function lines(path: string): Promise<string[]>;

  /**
   * Obtains a listing of the specified directory.
   *
   * @param path - The directory path to list.
   *
   * @returns Returns a promise resolving to an array of stat detail objects or rejecting with an error stating the failure reason.
   */
  function list(path: string): Promise<FileStatEntry[]>;

  /**
   * Read the contents of the given file and return them. Note: this function is unsuitable for obtaining binary data.
   *
   * @param path - The file path to read.
   *
   * @returns Returns a promise resolving to a string containing the file contents or rejecting with an error stating the failure reason.
   */
  function read(path: string): Promise<string>;

  /**
   * Read the contents of the given file and return them, bypassing ubus.
   *
   * This function will read the requested file through the cgi-io helper applet at `/cgi-bin/cgi-download` which bypasses the ubus rpc transport. This is useful to fetch large file contents which might exceed the ubus message size limits or which contain binary data.
   *
   * The cgi-io helper will enforce the same access permission rules as the ubus based read call.
   *
   * @param path - The file path to read.
   * @param type - The expected type of read file contents. Valid values are `text` to interpret the contents as string, `json` to parse the contents as JSON or `blob` to return the contents as Blob instance.
   *
   * @returns Returns a promise resolving with the file contents interpreted according to the specified type or rejecting with an error stating the failure reason.
   */
  function read_direct(path: string, type?: string): Promise<any>;

  /**
   * Unlink the given file.
   *
   * @param path - The file path to remove.
   *
   * @returns Returns a promise resolving to `0` or rejecting with an error stating the failure reason.
   */
  function remove(path: string): Promise<number>;

  /**
   * Return file stat information on the specified path.
   *
   * @param path - The filesystem path to stat.
   *
   * @returns Returns a promise resolving to a stat detail object or rejecting with an error stating the failure reason.
   */
  function stat(path: string): Promise<FileStatEntry>;

  /**
   * Read the contents of the given file, trim leading and trailing white space and return the trimmed result. In case of errors, return an empty string instead.
   *
   * This function is guaranteed to not reject its promises, on failure, an empty string will be returned.
   *
   * @remarks
   * this function is useful to read single-value files in `/sys` or `/proc`.
   *
   * @param path - The file path to read.
   *
   * @returns Returns a promise resolving to the file contents or the empty string on failure.
   */
  function trimmed(path: string): Promise<string>;

  /**
   * Write the given data to the specified file path. If the specified file path does not exist, it will be created, given sufficient permissions.
   *
   * @remarks
   * `data` will be converted to a string using `String(data)` or to `''` when it is `null`.
   *
   * @param path - The file path to write to.
   * @param data - The file data to write. If it is null, it will be set to an empty string.
   * @param mode - The permissions to use on file creation. Default is 420 (0644).
   *
   * @returns Returns a promise resolving to `0` or rejecting with an error stating the failure reason.
   */
  function write(path: string, data?: any, mode?: number): Promise<number>;

  type FileExecResult = {
    /**
     * The exit code of the invoked command
     */
    code: number;

    /**
     * The stdout produced by the command, if any
     */
    stdout?: string;

    /**
     * The stderr produced by the command, if any
     */
    stderr?: string;
  };

  type FileStatEntry = {
    /**
     * Name of the directory entry
     */
    name: string;

    /**
     * Type of the entry, one of `block`, `char`, `directory`, `fifo`, `symlink`, `file`, `socket` or `unknown`
     */
    type:
      | "block"
      | "char"
      | "directory"
      | "fifo"
      | "symlink"
      | "file"
      | "socket"
      | "unknown";

    /**
     * Size in bytes
     */
    size: number;

    /**
     * Access permissions
     */
    mode: number;

    /**
     * Last access time in seconds since epoch
     */
    atime: number;

    /**
     * Last modification time in seconds since epoch
     */
    mtime: number;

    /**
     * Last change time in seconds since epoch
     */
    ctime: number;

    /**
     * Inode number
     */
    inode: number;

    /**
     * Numeric owner id
     */
    uid: number;

    /**
     * Numeric group id
     */
    gid: number;
  };
}
