// Type definitions for LuCI2
// Documentation: http://openwrt.github.io/luci/jsapi/index.html
// Definitions by: Xingwang Liao <https://github.com/kuoruan>
// Definitions: https://github.com/kuoruan/es-packages
// TypeScript Version: 3.8

export import baseclass = require("./typings/baseclass");
export import dom = require("./typings/dom");
export import firewall = require("./typings/firewall");
export import form = require("./typings/form");
export import fs = require("./typings/fs");
export import LuCI = require("./typings/luci");
export import network = require("./typings/network");
export import prng = require("./typings/prng");
export import request = require("./typings/request");
export import rpc = require("./typings/rpc");
export import session = require("./typings/session");
export import uci = require("./typings/uci");
export import ui = require("./typings/ui");
export import validation = require("./typings/validation");
export import view = require("./typings/view");
export import widgets = require("./typings/widgets");
export import XHR = require("./typings/xhr");

// alias for prng
export import random = prng;

declare global {
  interface String {
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
   * Translate function
   *
   * @param str - The string to be tanslated.
   */
  function _(str: string): string;

  /**
   * Alias of LuCI
   */
  const L: LuCI;

  /**
   * Alias of dom.create
   */
  const E: typeof LuCI.dom.create;
}
