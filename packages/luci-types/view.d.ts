import baseclass from "./baseclass";

export as namespace view;
export = view;

declare abstract class view<T = any> extends baseclass {
  addFooter(): DocumentFragment;

  handleReset(ev: Event): Promise<any>[] | Promise<any>;

  abstract load(): Promise<T> | Promise<T>[];

  abstract render(load_results: T): Node | Promise<Node>;
}
declare namespace view {}
