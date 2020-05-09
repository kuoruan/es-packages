export as namespace fs;
export = fs;

declare namespace fs {
  function exec(
    command: string,
    params?: string[],
    env?: { [key: string]: string }
  ): Promise<FileExecResult>;

  type FileExecResult = {
    code: number;
    stdout?: string;
    stderr?: string;
  };

  type FileStatEntry = {
    name: string;
    type:
      | "block"
      | "char"
      | "directory"
      | "fifo"
      | "symlink"
      | "file"
      | "socket"
      | "unknown";
    size: number;
    mode: number;
    atime: number;
    mtime: number;
    ctime: number;
    inode: number;
    uid: number;
    gid: number;
  };
}
