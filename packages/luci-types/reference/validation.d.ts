declare namespace LuCI {
  class validation {
    create(
      field: Node,
      type: LuCI.validation.DataTypes,
      optional: boolean,
      vfunc: () => boolean
    ): LuCI.validation.Validator;

    compile(code: number): string[];

    parseInteger(x: string): number;

    parseDecimal(x: string): number;

    parseIPv4(x: string): [number, number, number, number] | null;

    parseIPv4(x: string): string[] | null;
  }

  namespace validation {
    type DataTypes =
      | "integer"
      | "uinteger"
      | "float"
      | "ufloat"
      | "ipaddr"
      | "ip4addr"
      | "ip6addr"
      | "ip4prefix"
      | "ip6prefix"
      | "cidr"
      | "cidr4"
      | "cidr6"
      | "ipnet4"
      | "ipnet6"
      | "ip6hostid"
      | "ipmask"
      | "ipmask4"
      | "ipmask6"
      | "port"
      | "portrange"
      | "macaddr"
      | "host"
      | "hostname"
      | "network"
      | "hostport"
      | "ip4addrport"
      | "ipaddrport"
      | "wpakey"
      | "wepkey"
      | "uciname"
      | "range"
      | "min"
      | "max"
      | "length"
      | "rangelength"
      | "minlength"
      | "maxlength"
      | "or"
      | "and"
      | "neg"
      | "list"
      | "phonedigit"
      | "timehhmmss"
      | "dateyyyymmdd"
      | "unique"
      | "hexstring"
      | "string";

    type Validator = {
      assert(condition: boolean, message: string): boolean;

      apply(
        name: string | (() => void),
        value: any,
        args: any[]
      ): any | Promise<any>;

      validate: () => boolean;
    };
  }
}
