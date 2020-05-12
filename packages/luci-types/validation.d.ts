// Type definitions for LuCI.validation
// Documentation: http://openwrt.github.io/luci/jsapi/LuCI.validation.html
// Definitions by: Xingwang Liao <https://github.com/kuoruan>
// TypeScript Version: 3.8

export as namespace validation;
export = ValidatorFactory;

declare class Validator {
  assert(condition: boolean, message: string): boolean;
}

declare namespace ValidatorFactory {
  function create(
    field: Node,
    type: keyof ITypes,
    optional: boolean,
    vfunc: Function
  ): Validator;

  interface ITypes {
    integer(): ReturnType<Validator["assert"]>;
  }

  const types: ITypes;
}
