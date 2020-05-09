export as namespace uci;
export = uci;

declare namespace uci {
  type ChangeRecord = [
    "add" | "set" | "remove" | "order" | "list-add" | "list-del" | "rename",
    string,
    string,
    string
  ];

  type SectionObject = {
    [".anonymous"]: boolean;
    [".index"]: number;
    [".name"]: string;
    [".type"]: string;
    [key: string]: boolean | number | string | string[];
  };

  type sectionsFn = (section: SectionObject, sid: string) => void;

  function load(config: string | string[]): Promise<string[]>;

  function add(config: string, type: string, name: string): string;

  function get(config: string, sid: string): null | SectionObject;

  function get(
    config: string,
    sid: string,
    option: string
  ): null | string | string[];

  function sections(config: string, type: string, cb: Function): any[];
}
