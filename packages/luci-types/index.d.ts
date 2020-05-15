// Type definitions for LuCI2
// Documentation: http://openwrt.github.io/luci/jsapi/index.html
// Definitions by: Xingwang Liao <https://github.com/kuoruan>
// Definitions: https://github.com/kuoruan/es-packages
// TypeScript Version: 3.8

export import baseclass = require("./baseclass");
export import dom = require("./dom");
export import firewall = require("./firewall");
export import form = require("./form");
export import fs = require("./fs");
export import LuCI = require("./luci");
export import network = require("./network");
export import prng = require("./prng");
export import request = require("./request");
export import rpc = require("./rpc");
export import session = require("./session");
export import uci = require("./uci");
export import ui = require("./ui");
export import validation = require("./validation");
export import view = require("./view");
export import widgets = require("./widgets");
export import XHR = require("./xhr");

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
