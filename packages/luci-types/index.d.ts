// Type definitions for LuCI2
// Documentation: http://openwrt.github.io/luci/jsapi/index.html
// Definitions by: Xingwang Liao <https://github.com/kuoruan>
// Definitions: https://github.com/kuoruan/es-packages
// TypeScript Version: 3.8

export import baseclass = require("./baseclass");
export import dom = require("./dom");
export import form = require("./form");
export import fs = require("./fs");
export import LuCI = require("./luci");
export import network = require("./network");
export import request = require("./request");
export import rpc = require("./rpc");
export import session = require("./session");
export import uci = require("./uci");
export import ui = require("./ui");
export import validation = require("./validation");
export import view = require("./view");
export import XHR = require("./xhr");

declare global {
  interface String {
    format: (...args: any[]) => string;
  }

  function _(s: string): string;

  const L: LuCI;
  const E: typeof LuCI.dom.create;
}
