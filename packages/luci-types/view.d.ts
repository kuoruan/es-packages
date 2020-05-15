// Type definitions for LuCI.view
// Documentation: http://openwrt.github.io/luci/jsapi/LuCI.view.html
// Definitions by: Xingwang Liao <https://github.com/kuoruan>
// TypeScript Version: 3.8

import baseclass from "./baseclass";

export as namespace view;
export = view;

type Newable<T = {}> = new (...args: any[]) => T;

/**
 * The `view` class forms the basis of views and provides a standard set of methods to inherit from.
 */
declare class view<L = void> extends baseclass {
  static extend<E = void, P extends {} = {}, T extends baseclass = view<E>>(
    this: Newable<T>,
    properties: P & Partial<T> & ThisType<T & P>
  ): P & T;

  /**
   * Renders a standard page action footer if any of the `handleSave()`, `handleSaveApply()` or `handleReset()` functions are defined.
   *
   * The default implementation should be sufficient for most views - it will render a standard page footer with action buttons labeled `Save`, `Save & Apply` and `Reset` triggering the `handleSave()`, `handleSaveApply()` and `handleReset()` functions respectively.
   *
   * When any of these `handle*()` functions is overwritten with `null` by a view extending this class, the corresponding button will not be rendered.
   *
   * @returns Returns a `DocumentFragment` containing the footer bar with buttons for each corresponding `handle*()` action or an empty `DocumentFragment` if all three `handle*()` methods are overwritten with `null`.
   */
  addFooter(): DocumentFragment;

  /**
   * The handleReset function is invoked when the user clicks the `Reset` button in the page action footer.
   *
   * The default implementation should be sufficient for most views using `form.Map()` based forms - it will iterate all forms present in the view and invoke the `Map.reset()` method on each form.
   *
   * Views not using `Map` instances or requiring other special logic should overwrite `handleReset()` with a custom implementation.
   *
   * To disable the `Reset` page footer button, views extending this base class should overwrite the `handleReset` function with `null`.
   *
   * The invocation of this function is wrapped by `Promise.resolve()` so it may return Promises if needed.
   *
   * @param ev - The DOM event that triggered the function.
   *
   * @returns Any return values of this function are discarded, but passed through `Promise.resolve()` to ensure that any returned promise runs to completion before the button is reenabled.
   */
  handleReset: ((ev: Event) => any | Promise<any>) | null;

  /**
   * The handleSave function is invoked when the user clicks the `Save` button in the page action footer.
   *
   * The default implementation should be sufficient for most views using `form.Map()` based forms - it will iterate all forms present in the view and invoke the `Map.save()` method on each form.
   *
   * Views not using `Map` instances or requiring other special logic should overwrite `handleSave()` with a custom implementation.
   *
   * To disable the `Save` page footer button, views extending this base class should overwrite the `handleSave` function with `null`.
   *
   * The invocation of this function is wrapped by `Promise.resolve()` so it may return Promises if needed.
   *
   * @param ev - The DOM event that triggered the function.
   *
   * @returns Any return values of this function are discarded, but passed through `Promise.resolve()` to ensure that any returned promise runs to completion before the button is reenabled.
   */
  handleSave: ((ev: Event) => any | Promise<any>) | null;

  /**
   * The handleSaveApply function is invoked when the user clicks the `Save & Apply` button in the page action footer.
   *
   * The default implementation should be sufficient for most views using `form.Map()` based forms - it will first invoke `view.handleSave()` and then call `ui.changes.apply()` to start the modal config apply and page reload flow.
   *
   * Views not using `Map` instances or requiring other special logic should overwrite `handleSaveApply()` with a custom implementation.
   *
   * To disable the `Save & Apply` page footer button, views extending this base class should overwrite the handleSaveApply function with `null`.
   *
   * The invocation of this function is wrapped by `Promise.resolve()` so it may return Promises if needed.
   *
   * @param ev - The DOM event that triggered the function.
   *
   * @returns Any return values of this function are discarded, but passed through `Promise.resolve()` to ensure that any returned promise runs to completion before the button is reenabled.
   */
  handleSaveApply: ((ev: Event) => any | Promise<any>) | null;

  /**
   * The load function is invoked before the view is rendered.
   *
   * The invocation of this function is wrapped by `Promise.resolve()` so it may return Promises if needed.
   *
   * The return value of the function (or the resolved values of the promise returned by it) will be passed as first argument to `render()`.
   *
   * This function is supposed to be overwritten by subclasses, the default implementation does nothing.
   *
   * @returns May return any value or a Promise resolving to any value.
   */
  load(): L | Promise<L>;

  /**
   * The render function is invoked after the `load()` function and responsible for setting up the view contents. It must return a DOM `Node` or `DocumentFragment` holding the contents to insert into the view area.
   *
   * The invocation of this function is wrapped by `Promise.resolve()` so it may return Promises if needed.
   *
   * The return value of the function (or the resolved values of the promise returned by it) will be inserted into the main content area using `dom.append()`.
   *
   * This function is supposed to be overwritten by subclasses, the default implementation does nothing.
   *
   * @param load_results - This function will receive the return value of the `view.load()` function as first argument.
   *
   * @returns Should return a DOM `Node` value or a `Promise` resolving to a `Node` value.
   */
  render(load_results: L | null): Node | Promise<Node>;
}
declare namespace view {}
