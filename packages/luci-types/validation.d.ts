// Type definitions for LuCI.validation
// Documentation: http://openwrt.github.io/luci/jsapi/LuCI.validation.html
// Definitions by: Xingwang Liao <https://github.com/kuoruan>
// TypeScript Version: 3.8

export as namespace validation;
export = ValidatorFactory;

declare class Validator {
  constructor(field: Node, type: ValidatorFactory.DataTypes, optional: boolean, vfunc: Function, validatorFactory: typeof ValidatorFactory);

  assert(condition: boolean, message: string): boolean;

  apply(name: string | Function, value: any, args: any[]): any | Promise<any>;

  validate(): boolean;
}

declare namespace ValidatorFactory {
  function create(
    field: Node,
    type: DataTypes,
    optional: boolean,
    vfunc: Function
  ): Validator;

  function compile(code: number): string[];

  function parseInteger(x: string): number;

  function parseDecimal(x: string): number;

  function parseIPv4(x: string): [number, number, number, number] | null;

  function parseIPv4(x: string): string[] | null;

  interface types {
    integer(): boolean;

    uinteger(): boolean;

    float(): boolean;

    ufloat(): boolean;

    ipaddr(): boolean;

    ip4addr(): boolean;

    ip6addr(): boolean;

    ip4prefix(): boolean;

    ip6prefix(): boolean;

    cidr(): boolean;

    cidr4(): boolean;

    cidr6(): boolean;

    ipnet4(): boolean;

    ipnet6(): boolean;

    ip6hostid(): boolean;

    ipmask(): boolean;

    ipmask4(): boolean;

    ipmask6(): boolean;

    port(): boolean;

    portrange(): boolean;

    macaddr(): boolean;

    host(): boolean;

    hostname(): boolean;

    network(): boolean;

    hostport(): boolean;

    ip4addrport(): boolean;

    ipaddrport(): boolean;

    wpakey(): boolean;

    wepkey(): boolean;

    uciname(): boolean;

    range(): boolean;

    min(): boolean;

    max(): boolean;

    length(): boolean;

    rangelength(): boolean;

    minlength(): boolean;

    maxlength(): boolean;

    or(): boolean;

    and(): boolean;

    neg(): boolean;

    list(): boolean;

    phonedigit(): boolean;

    timehhmmss(): boolean;

    dateyyyymmdd(): boolean;

    unique(): boolean;

    hexstring(): boolean;

    string(): boolean;
  }

  type DataTypes = keyof types;
}
