// Type definitions for LuCI2
// Documentation: http://openwrt.github.io/luci/jsapi/index.html
// Definitions by: Xingwang Liao <https://github.com/kuoruan>
// Definitions: https://github.com/kuoruan/es-packages
// TypeScript Version: 3.8

/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="./reference/baseclass.d.ts" />
/// <reference path="./reference/dom.d.ts" />
/// <reference path="./reference/firewall.d.ts" />
/// <reference path="./reference/form.d.ts" />
/// <reference path="./reference/fs.d.ts" />
/// <reference path="./reference/headers.d.ts" />
/// <reference path="./reference/luci.d.ts" />
/// <reference path="./reference/network.d.ts" />
/// <reference path="./reference/poll.d.ts" />
/// <reference path="./reference/prng.d.ts" />
/// <reference path="./reference/request.d.ts" />
/// <reference path="./reference/response.d.ts" />
/// <reference path="./reference/rpc.d.ts" />
/// <reference path="./reference/session.d.ts" />
/// <reference path="./reference/uci.d.ts" />
/// <reference path="./reference/ui.d.ts" />
/// <reference path="./reference/validation.d.ts" />
/// <reference path="./reference/view.d.ts" />
/// <reference path="./reference/widgets.d.ts" />
/// <reference path="./reference/xhr.d.ts" />

type Newable<T = Record<string, never>> = new (...args: any) => T;

declare interface String {
  /**
   * Format string
   */
  format(...args: any[]): string;

  /**
   * Replace spaces (`\s`) and new-lines (`\n`) to no-break space (`&#160;`)
   */
  nobr(): string;
}

/**
 * Alias of LuCI
 */
declare const L: LuCI;

/**
 * Alias of dom.create
 */
declare const E: typeof LuCI.dom.prototype.create;

/**
 * Translate function
 *
 * @param str - The string to be tanslated.
 */
declare function _(str: string): string;

declare const fs: LuCI.fs;
