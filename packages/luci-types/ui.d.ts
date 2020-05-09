import baseclass from "./baseclass";

export as namespace ui;
export = ui;

declare namespace ui {
  function addNotification(
    title: string | null,
    contents: any,
    classes?: string
  ): Node;

  function addValidator(
    field: Node,
    type: string,
    optional?: boolean,
    vfunc?: Function,
    events?: string
  ): Function;

  class AbstractElement extends baseclass {
    getValue(): string | string[] | null;

    isValid(): boolean;

    registerEvents(targetNode: Node, synevent: string, events: string[]): void;

    render(): Node;

    setChangeEvents(targetNode: Node, events: string): void;

    setUpdateEvents(targetNode: Node, events: string): void;

    setValue(value: string | string[] | null): void;

    triggerValidation(): void;
  }

  namespace AbstractElement {
    type InitOptionsObject = {
      id: string;
      name: string;
      optional: boolean;
      datatype: string;
      validator: Function;
      disabled: boolean;
    };
  }
}
