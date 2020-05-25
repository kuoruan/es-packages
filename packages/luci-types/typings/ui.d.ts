// Type definitions for LuCI.ui
// Documentation: http://openwrt.github.io/luci/jsapi/LuCI.ui.html
// Definitions by: Xingwang Liao <https://github.com/kuoruan>
// TypeScript Version: 3.8

import baseclass from "./baseclass";

export as namespace ui;
export = ui;

/**
 * Provides high level UI helper functionality. To import the class in views,
 * use `'require ui'`, to import it in external JavaScript, use
 * `L.require("ui").then(...)`.
 */
declare namespace ui {
  /**
   * Add a notification banner at the top of the current view.
   *
   * A notification banner is an alert message usually displayed at the top of
   * the current view, spanning the entire availibe width. Notification banners
   * will stay in place until dismissed by the user. Multiple banners may be
   * shown at the same time.
   *
   * Additional CSS class names may be passed to influence the appearence of the
   * banner. Valid values for the classes depend on the underlying theme.
   *
   * @remarks {@link LuCI.dom.content}
   *
   * @param title - The title of the notification banner. If `null`, no title
   * element will be rendered.
   * @param contents - The contents to add to the notification banner. This
   * should be a DOM node or a document fragment in most cases. The value is
   * passed as-is to the `dom.content()` function - refer to its documentation
   * for applicable values.
   * @param classes - repeatable. A number of extra CSS class names which are
   * set on the notification banner element.
   *
   * @returns Returns a DOM Node representing the notification banner element.
   */
  function addNotification(
    title: string | null,
    contents: any,
    ...classes: string[]
  ): Node;

  /**
   * Add validation constraints to an input element.
   *
   * Compile the given type expression and optional validator function into a
   * validation function and bind it to the specified input element events.
   *
   * @remarks {@link LuCI.validation}
   *
   * @param field - The DOM input element node to bind the validation
   * constraints to.
   * @param type - The datatype specification to describe validation
   * constraints. Refer to the `LuCI.validation` class documentation for
   * details.
   * @param optional - Specifies whether empty values are allowed (`true`) or
   * not (`false`). If an input element is not marked optional it must not be
   * empty, otherwise it will be marked as invalid.
   * @param vfunc - Specifies a custom validation function which is invoked
   * after the other validation constraints are applied. The validation must
   * return `true` to accept the passed value. Any other return type is
   * converted to a string and treated as validation error message.
   * @param events - repeatable. The list of events to bind. Each received event
   * will trigger a field validation. If omitted, the `keyup` and `blur` events
   * are bound by default.
   *
   * @returns Returns the compiled validator function which can be used to
   * manually trigger field validation or to bind it to further events.
   */
  function addValidator(
    field: Node,
    type: LuCI.validation.DataTypes,
    optional?: boolean,
    vfunc?: Function,
    ...events: string[]
  ): Function;

  /**
   * Wait for device to come back online and reconnect to it.
   *
   * Poll each given hostname or IP address and navigate to it as soon as one of
   * the addresses becomes reachable.
   *
   * @param hosts - repeatable. The list of IP addresses and host names to check
   * for reachability. If omitted, the current value of `window.location.host`
   * is used by default.
   */
  function awaitReconnect(...hosts: string[]): void;

  /**
   * Create a pre-bound event handler function.
   *
   * Generate and bind a function suitable for use in event handlers. The
   * generated function automatically disables the event source element and adds
   * an active indication to it by adding appropriate CSS classes.
   *
   * It will also await any promises returned by the wrapped function and
   * re-enable the source element after the promises ran to completion.
   *
   * @param ctx - The `this` context to use for the wrapped function.
   * @param fn - Specifies the function to wrap. In case of a function value,
   * the function is used as-is. If a string is specified instead, it is looked
   * up in `ctx` to obtain the function to wrap. In both cases the bound
   * function will be invoked with `ctx` as `this` context
   * @param extra_args - repeatable. Any further parameter as passed as-is to
   * the bound event handler function in the same order as passed to
   * `createHandlerFn()`.
   *
   * @returns Returns the pre-bound handler function which is suitable to be
   * passed to `addEventListener()`. Returns `null` if the given `fn` argument
   * is a string which could not be found in `ctx` or if `ctx[fn]` is not a
   * valid function value.
   */
  function createHandlerFn<T, F extends (this: T, ...args: any[]) => any>(
    ctx: T,
    fn: F | string,
    ...extra_args: any[]
  ): ((...args: any[]) => any) | null;

  /**
   * Remove an header area indicator.
   *
   * This function removes the given indicator label from the header indicator
   * area. When the given indicator is not found, this function does nothing.
   *
   * @param id - The ID of the indicator to remove.
   *
   * @returns Returns `true` when the indicator has been removed or `false` when
   * the requested indicator was not found.
   */
  function hideIndicator(id: string): boolean;

  /**
   * Close the open modal overlay dialog.
   *
   * This function will close an open modal dialog and restore the normal view
   * behaviour. It has no effect if no modal dialog is currently open.
   *
   * Note that this function is stand-alone, it does not rely on this and will
   * not invoke other class functions so it suitable to be used as event handler
   * as-is without the need to bind it first.
   */
  function hideModal(): void;

  /**
   * Load specified view class path and set it up.
   *
   * Transforms the given view path into a class name, requires it using
   * `LuCI.require()` and asserts that the resulting class instance is a
   * descendant of `LuCI.view`.
   *
   * By instantiating the view class, its corresponding contents are rendered
   * and included into the view area. Any runtime errors are catched and
   * rendered using `LuCI.error()`.
   *
   * @param path - The view path to render.
   *
   * @returns Returns a promise resolving to the loaded view instance.
   */
  function instantiateView(path: string): Promise<LuCI.view>;

  /**
   * Formats a series of label/value pairs into list-like markup.
   *
   * This function transforms a flat array of alternating label and value
   * elements into a list-like markup, using the values in `separators` as
   * separators and appends the resulting nodes to the given parent DOM node.
   *
   * Each label is suffixed with `:` and wrapped into a `<strong>` tag, the
   * `<strong>` element and the value corresponding to the label are
   * subsequently wrapped into a `<span class="nowrap">` element.
   *
   * The resulting `<span>` element tuples are joined by the given separators to
   * form the final markup which is appened to the given parent DOM node.
   *
   * @param node - The parent DOM node to append the markup to. Any previous
   * child elements will be removed.
   * @param items - An alternating array of labels and values. The label values
   * will be converted to plain strings, the values are used as-is and may be of
   * any type accepted by `LuCI.dom.content()`.
   * @param separators - A single value or an array of separator values to
   * separate each label/value pair with. The function will cycle through the
   * separators when joining the pairs. If omitted, the default separator is a
   * sole HTML `<br>` element. Separator values are used as-is and may be of any
   * type accepted by `LuCI.dom.content()`.
   *
   * @returns Returns the parent DOM node the formatted markup has been added
   * to.
   */
  function itemlist(node: Node, items: any[], separators?: any | any[]): Node;

  /**
   * Perform a device connectivity test.
   *
   * Attempt to fetch a well known ressource from the remote device via HTTP in
   * order to test connectivity. This function is mainly useful to wait for the
   * router to come back online after a reboot or reconfiguration.
   *
   * @param proto - The protocol to use for fetching the resource. May be either
   * `http` (the default) or `https`.
   * @param host - Override the host address to probe. By default the current
   * host as seen in the address bar is probed.
   *
   * @returns Returns a promise resolving to a `load` event in case the device
   * is reachable or rejecting with an `error` event in case it is not reachable
   * or rejecting with `null` when the connectivity check timed out.
   */
  function pingDevice(proto?: "http" | "https", host?: string): Promise<Event>;

  /**
   * Display or update an header area indicator.
   *
   * An indicator is a small label displayed in the header area of the screen
   * providing few amounts of status information such as item counts or state
   * toggle indicators.
   *
   * Multiple indicators may be shown at the same time and indicator labels may
   * be made clickable to display extended information or to initiate further
   * actions.
   *
   * Indicators can either use a default `active` or a less accented `inactive`
   * style which is useful for indicators representing state toggles.
   *
   * @param id - The ID of the indicator. If an indicator with the given ID
   * already exists, it is updated with the given label and style.
   * @param label - The text to display in the indicator label.
   * @param handler - A handler function to invoke when the indicator label is
   * clicked/touched by the user. If omitted, the indicator is not
   * clickable/touchable.
   *
   * Note that this parameter only applies to new indicators, when updating
   * existing labels it is ignored.
   * @param style - The indicator style to use. May be either `active` or
   * `inactive`.
   *
   * @returns Returns `true` when the indicator has been updated or `false` when
   * no changes were made.
   */
  function showIndicator(
    id: string,
    label: string,
    handler?: Function,
    style?: "active" | "inactive"
  ): boolean;

  /**
   * Display a modal overlay dialog with the specified contents.
   *
   * The modal overlay dialog covers the current view preventing interaction
   * with the underlying view contents. Only one modal dialog instance can be
   * opened. Invoking showModal() while a modal dialog is already open will
   * replace the open dialog with a new one having the specified contents.
   *
   * Additional CSS class names may be passed to influence the appearence of the
   * dialog. Valid values for the classes depend on the underlying theme.
   *
   * @remarks {@link LuCI.dom.content}
   *
   * @param title - The title of the dialog. If `null`, no title element will be
   * rendered.
   * @param contents - The contents to add to the modal dialog. This should be a
   * DOM node or a document fragment in most cases. The value is passed as-is to
   * the `dom.content()` function - refer to its documentation for applicable
   * values.
   * @param classes - repeatable. A number of extra CSS class names which are
   * set on the modal dialog element.
   *
   * @returns Returns a DOM Node representing the modal dialog element.
   */
  function showModal(
    title: string | null,
    contents: any,
    ...classes: string[]
  ): Node;

  /**
   * Display a modal file upload prompt.
   *
   * This function opens a modal dialog prompting the user to select and upload
   * a file to a predefined remote destination path.
   *
   * @param path - The remote file path to upload the local file to.
   * @param progessStatusNode - An optional DOM text node whose content text is
   * set to the progress percentage value during file upload.
   *
   * @returns Returns a promise resolving to a file upload status object on
   * success or rejecting with an error in case the upload failed or has been
   * cancelled by the user.
   */
  function uploadFile(
    path: string,
    progessStatusNode?: Node
  ): Promise<FileUploadReply>;

  /**
   * The `AbstractElement` class serves as abstract base for the different
   * widgets implemented by `LuCI.ui`. It provides the common logic for getting
   * and setting values, for checking the validity state and for wiring up
   * required events.
   *
   * UI widget instances are usually not supposed to be created by view code
   * directly, instead they're implicitely created by `LuCI.form` when
   * instantiating CBI forms.
   *
   * This class is automatically instantiated as part of `LuCI.ui`. To use it in
   * views, use `'require ui'` and refer to `ui.AbstractElement`. To import it
   * in external JavaScript, use `L.require("ui").then(...)` and access the
   * `AbstractElement` property of the class instance value.
   */
  class AbstractElement extends baseclass {
    /**
     * Read the current value of the input widget.
     *
     * @returns The current value of the input element. For simple inputs like
     * text fields or selects, the return value type will be a - possibly empty
     * - string. Complex widgets such as `DynamicList` instances may result in
     * an array of strings or `null` for unset values.
     */
    getValue(): string | string[] | null;

    /**
     * Check whether the current input value is valid.
     *
     * @returns Returns `true` if the current input value is valid or `false` if
     * it does not meet the validation constraints.
     */
    isValid(): boolean;

    /**
     * Dispatch a custom (synthetic) event in response to received events.
     *
     * Sets up event handlers on the given target DOM node for the given event
     * names that dispatch a custom event of the given type to the widget root
     * DOM node.
     *
     * The primary purpose of this function is to set up a series of custom
     * uniform standard events such as widget-update, validation-success,
     * validation-failure etc. which are triggered by various different widget
     * specific native DOM events.
     *
     * @param targetNode - Specifies the DOM node on which the native event
     * listeners should be registered.
     * @param synevent - The name of the custom event to dispatch to the widget
     * root DOM node.
     * @param events - The native DOM events for which event handlers should be
     * registered.
     */
    registerEvents(targetNode: Node, synevent: string, events: string[]): void;

    /**
     * Render the widget, setup event listeners and return resulting markup.
     *
     * @returns Returns a DOM Node or DocumentFragment containing the rendered
     * widget markup.
     */
    render(): Node;

    /**
     * Setup listeners for native DOM events that may change the widget value.
     *
     * Sets up event handlers on the given target DOM node for the given event
     * names which may cause the input value to change completely, such as
     * `change` events in a select menu. In contrast to update events, such
     * change events will not trigger input value validation but they may cause
     * field dependencies to get re-evaluated and will mark the input widget as
     * dirty.
     *
     * @param targetNode - Specifies the DOM node on which the event listeners
     * should be registered.
     * @param events - repeatable. The DOM events for which event handlers
     * should be registered.
     */
    setChangeEvents(targetNode: Node, ...events: string[]): void;

    /**
     * Setup listeners for native DOM events that may update the widget value.
     *
     * Sets up event handlers on the given target DOM node for the given event
     * names which may cause the input value to update, such as `keyup` or
     * `onclick` events. In contrast to change events, such update events will
     * trigger input value validation.
     *
     * @param targetNode - Specifies the DOM node on which the event listeners
     * should be registered.
     * @param events - repeatable. The DOM events for which event handlers
     * should be registered.
     */
    setUpdateEvents(targetNode: Node, ...events: string[]): void;

    /**
     * Set the current value of the input widget.
     *
     * @param value - The value to set the input element to. For simple inputs
     * like text fields or selects, the value should be a - possibly empty -
     * string. Complex widgets such as `DynamicList` instances may accept string
     * array or `null` values.
     */
    setValue(value: string | string[] | null): void;

    /**
     * Force validation of the current input value.
     *
     * Usually input validation is automatically triggered by various DOM events
     * bound to the input widget. In some cases it is required though to
     * manually trigger validation runs, e.g. when programmatically altering
     * values.
     */
    triggerValidation(): void;
  }

  namespace AbstractElement {
    interface InitOptions {
      /**
       * Specifies the widget ID to use. It will be used as HTML `id` attribute
       * on the toplevel widget DOM node.
       */
      id?: string;

      /**
       * Specifies the widget `name` which is set as HTML name attribute on the
       * corresponding `<input>` element.
       */
      name?: string;

      /**
       * Specifies whether the input field allows empty values.
       *
       * @defaultValue true
       */
      optional?: boolean;

      /**
       * An expression describing the input data validation constraints. It
       * defaults to `string` which will allow any value. See `LuCI.validation`
       * for details on the expression format.
       *
       * @defaultValue string
       */
      datatype?: string;

      /**
       * Specifies a custom validator function which is invoked after the
       * standard validation constraints are checked. The function should return
       * `true` to accept the given input value. Any other return value type is
       * converted to a string and treated as validation error message.
       */
      validate?: (val: string) => boolean | string | object;

      /**
       * Specifies whether the widget should be rendered in disabled state
       * (`true`) or not (`false`). Disabled widgets cannot be interacted with
       * and are displayed in a slightly faded style.
       *
       * @defaultValue false
       */
      disabled?: boolean;
    }
  }

  namespace changes {
    /**
     * Apply the staged configuration changes.
     *
     * Start applying staged configuration changes and open a modal dialog with
     * a progress indication to prevent interaction with the view during the
     * apply process. The modal dialog will be automatically closed and the
     * current view reloaded once the apply process is complete.
     *
     * @param checked - Whether to perform a checked (`true`) configuration
     * apply or an unchecked (`false`) one. In case of a checked apply, the
     * configuration changes must be confirmed within a specific time interval,
     * otherwise the device will begin to roll back the changes in order to
     * restore the previous settings.
     */
    function apply(checked?: boolean): void;

    /**
     * Display the current changelog.
     *
     * Open a modal dialog visualizing the currently staged UCI changes and
     * offer options to revert or apply the shown changes.
     */
    function displayChanges(): void;

    /**
     * Update the change count indicator.
     *
     * This function updates the UCI change count indicator from the given UCI
     * changeset structure.
     *
     * @param changes - The UCI changeset to count.
     */
    function renderChangeIndicator(changes: {
      [key: string]: LuCI.uci.ChangeRecord[];
    }): void;

    /**
     * Revert the staged configuration changes.
     *
     * Start reverting staged configuration changes and open a modal dialog with
     * a progress indication to prevent interaction with the view during the
     * revert process. The modal dialog will be automatically closed and the
     * current view reloaded once the revert process is complete.
     */
    function revert(): void;

    /**
     * Set the change count indicator.
     *
     * This function updates or hides the UCI change count indicator, depending
     * on the passed change count. When the count is greater than 0, the change
     * indicator is displayed or updated, otherwise it is removed.
     *
     * @param numChanges - The number of changes to indicate.
     */
    function setIndicator(numChanges: number): void;
  }

  /**
   * The `Checkbox` class implements a simple checkbox input field.
   *
   * UI widget instances are usually not supposed to be created by view code
   * directly, instead they're implicitely created by `LuCI.form` when
   * instantiating CBI forms.
   *
   * This class is automatically instantiated as part of `LuCI.ui`. To use it in
   * views, use `'require ui'` and refer to `ui.Checkbox`. To import it in
   * external JavaScript, use `L.require("ui").then(...)` and access the
   * `Checkbox` property of the class instance value.
   */
  class CheckBox extends AbstractElement {
    /**
     * Instantiate a checkbox widget.
     *
     * @param value - The initial input value.
     * @param options - Object describing the widget specific options to
     * initialize the input.
     */
    constructor(value?: string, options?: CheckBox.InitOptions);

    /**
     * Test whether the checkbox is currently checked.
     *
     * @returns Returns `true` when the checkbox is currently checked, otherwise
     * `false`.
     */
    isChecked(): boolean;
  }

  namespace CheckBox {
    interface InitOptions extends AbstractElement.InitOptions {
      /**
       * Specifies the value corresponding to a checked checkbox.
       *
       * @defaultValue 1
       */
      value_enabled?: string;

      /**
       * Specifies the value corresponding to an unchecked checkbox.
       *
       * @defaultValue 0
       */
      value_disabled?: string;

      /**
       * Specifies the HTML `name` attribute of the hidden input backing the
       * checkbox. This is a legacy property existing for compatibility reasons,
       * it is required for HTML based form submissions.
       */
      hiddenname?: string;
    }
  }

  /**
   * The `Combobox` class implements a rich, stylable dropdown menu which allows
   * to enter custom values. Historically, comboboxes used to be a dedicated
   * widget type in LuCI but nowadays they are direct aliases of dropdown
   * widgets with a set of enforced default properties for easier instantiation.
   *
   * UI widget instances are usually not supposed to be created by view code
   * directly, instead they're implicitely created by `LuCI.form` when
   * instantiating CBI forms
   *
   * This class is automatically instantiated as part of `LuCI.ui`. To use it in
   * views, use `'require ui'` and refer to `ui.Combobox`. To import it in
   * external JavaScript, use `L.require("ui").then(...)` and access the
   * `Combobox` property of the class instance value.
   */
  class Combobox extends Dropdown {
    /**
     * Instantiate a rich dropdown choice widget allowing custom values.
     *
     * @param value - The initial input value(s).
     * @param choices - Object containing the selectable choices of the widget.
     * The object keys serve as values for the different choices while the
     * values are used as choice labels.
     * @param options - Object describing the widget specific options to
     * initialize the dropdown.
     */
    constructor(
      value: string | string[] | null,
      choices: { [key: string]: any },
      options?: Combobox.InitOptions
    );
  }

  namespace Combobox {
    interface InitOptions extends Dropdown.InitOptions {
      /**
       * Since Comboboxes never allow selecting multiple values, this property
       * is forcibly set to `false`.
       *
       * @defaultValue false
       */
      multiple?: false;

      /**
       * Since Comboboxes always allow custom choice values, this property is
       * forcibly set to `true`.
       *
       * @defaultValue true
       */
      create?: true;

      /**
       * Since Comboboxes are always optional, this property is forcibly set to
       * `true`.
       *
       * @defaultValue true
       */
      optional?: true;
    }
  }

  /**
   * The `ComboButton` class implements a button element which can be expanded
   * into a dropdown to chose from a set of different action choices.
   *
   * UI widget instances are usually not supposed to be created by view code
   * directly, instead they're implicitely created by `LuCI.form` when
   * instantiating CBI forms.
   *
   * This class is automatically instantiated as part of `LuCI.ui`. To use it in
   * views, use `'require ui'` and refer to `ui.ComboButton`. To import it in
   * external JavaScript, use `L.require("ui").then(...)` and access the
   * `ComboButton` property of the class instance value.
   */
  class ComboButton extends Dropdown {
    /**
     * Instantiate a combo button widget offering multiple action choices.
     *
     * @param value - The initial input value(s).
     * @param choices - Object containing the selectable choices of the widget.
     * The object keys serve as values for the different choices while the
     * values are used as choice labels.
     * @param options - Object describing the widget specific options to
     * initialize the button.
     */
    constructor(
      value: string | string[] | null,
      choices: { [key: string]: any },
      options?: ComboButton.InitOptions
    );
  }

  namespace ComboButton {
    /**
     * ComboButtons support the same properties as `Dropdown.InitOptions` but
     * enforce specific values for some properties and add aditional button
     * specific properties.
     */
    interface InitOptions extends Dropdown.InitOptions {
      /**
       * Since ComboButtons never allow selecting multiple actions, this
       * property is forcibly set to `false`.
       *
       * @defaultValue false
       */
      multiple?: false;

      /**
       * Since ComboButtons never allow creating custom choices, this property
       * is forcibly set to `false`.
       *
       * @defaultValue false
       */
      create?: false;

      /**
       * Since ComboButtons must always select one action, this property is
       * forcibly set to `false`.
       *
       * @defaultValue false
       */
      optional?: false;

      /**
       * Specifies a mapping of choice values to CSS class names. If an action
       * choice is selected by the user and if a corresponding entry exists in
       * the `classes` object, the class names corresponding to the selected
       * value are set on the button element.
       *
       * This is useful to apply different button styles, such as colors, to the
       * combined button depending on the selected action.
       */
      classes?: { [key: string]: string };

      /**
       * Specifies a handler function to invoke when the user clicks the button.
       * This function will be called with the button DOM node as `this` context
       * and receive the DOM click event as first as well as the selected action
       * choice value as second argument.
       */
      click?: Function;
    }
  }

  /**
   * The `Dropdown` class implements a rich, stylable dropdown menu which
   * supports non-text choice labels.
   *
   * UI widget instances are usually not supposed to be created by view code
   * directly, instead they're implicitely created by `LuCI.form` when
   * instantiating CBI forms.
   *
   * This class is automatically instantiated as part of `LuCI.ui`. To use it in
   * views, use `'require ui'` and refer to `ui.Dropdown`. To import it in
   * external JavaScript, use `L.require("ui").then(...)` and access the
   * `Dropdown` property of the class instance value.
   */
  class Dropdown extends AbstractElement {
    /**
     * Instantiate a rich dropdown choice widget.
     *
     * @param value - The initial input value(s).
     * @param choices - Object containing the selectable choices of the widget.
     * The object keys serve as values for the different choices while the
     * values are used as choice labels.
     * @param options - Object describing the widget specific options to
     * initialize the dropdown.
     */
    constructor(
      value: string | string[] | null,
      choices: { [key: string]: any },
      options?: Dropdown.InitOptions
    );

    /**
     * Add new choices to the dropdown menu.
     *
     * This function adds further choices to an existing dropdown menu, ignoring
     * choice values which are already present.
     *
     * @param values - The choice values to add to the dropdown widget.
     * @param labels - The choice label values to use when adding dropdown
     * choices. If no label is found for a particular choice value, the value
     * itself is used as label text. Choice labels may be any valid value
     * accepted by `LuCI.dom#content`.
     */
    addChoices(values: string[], labels: { [key: string]: any }): void;

    /**
     * Remove all existing choices from the dropdown menu.
     *
     * This function removes all preexisting dropdown choices from the widget,
     * keeping only choices currently being selected unless `reset_values` is
     * given, in which case all choices and deselected and removed.
     *
     * @param reset_value - If set to true, deselect and remove selected choices
     * as well instead of keeping them.
     */
    clearChoices(reset_value?: boolean): void;

    /**
     * Close all open dropdown widgets in the current document.
     */
    closeAllDropdowns(): void;
  }

  namespace Dropdown {
    interface InitOptions extends AbstractElement.InitOptions {
      /**
       * Specifies whether the dropdown selection is optional. In contrast to
       * other widgets, the `optional` constraint of dropdowns works
       * differently; instead of marking the widget invalid on empty values when
       * set to `false`, the user is not allowed to deselect all choices.
       *
       * For single value dropdowns that means that no empty "please select"
       * choice is offered and for multi value dropdowns, the last selected
       * choice may not be deselected without selecting another choice first.
       *
       * @defaultValue true
       */
      optional?: boolean;

      /**
       * Specifies whether multiple choice values may be selected. It defaults
       * to `true` when an array is passed as input value to the constructor.
       */
      multiple?: boolean;

      /**
       * Specifies if and how to sort choice values. If set to `true`, the
       * choice values will be sorted alphabetically. If set to an array of
       * strings, the choice sort order is derived from the array.
       *
       * @defaultValue false
       */
      sort?: boolean | string[];

      /**
       * Specifies a placeholder text which is displayed when no choice is
       * selected yet.
       *
       * @defaultValue `-- Please choose --`
       */
      select_placeholder?: string;

      /**
       * Specifies a placeholder text which is displayed in the text input field
       * allowing to enter custom choice values. Only applicable if the `create`
       * option is set to `true`.
       *
       * @defaultValue `-- custom --`
       */
      custom_placeholder?: string;

      /**
       * Specifies whether custom choices may be entered into the dropdown
       * widget.
       *
       * @defaultValue false
       */
      create?: boolean;

      /**
       * Specifies a CSS selector expression used to find the input element
       * which is used to enter custom choice values. This should not normally
       * be used except by widgets derived from the Dropdown class.
       *
       * @defaultValue .create-item-input
       */
      create_query?: string;

      /**
       * Specifies a CSS selector expression used to find an HTML element
       * serving as template for newly added custom choice values.
       *
       * Any `{{value}}` placeholder string within the template elements text
       * content will be replaced by the user supplied choice value, the
       * resulting string is parsed as HTML and appended to the end of the
       * choice list. The template markup may specify one HTML element with a
       * `data-label-placeholder` attribute which is replaced by a matching
       * label value from the `choices` object or with the user supplied value
       * itself in case `choices` contains no matching choice label.
       *
       * If the template element is not found or if no `create_template`
       * selector expression is specified, the default markup for newly created
       * elements is
       * `<li data-value="{{value}}"><span data-label-placeholder="true" /></li>`.
       *
       * @defaultValue script[type="item-template"]
       */
      create_template?: string;

      /**
       * This property allows specifying the markup for custom choices directly
       * instead of referring to a template element through CSS selectors.
       *
       * Apart from that it works exactly like `create_template`.
       */
      create_markup?: string;

      /**
       * Specifies the maximum amount of choice labels that should be shown in
       * collapsed dropdown state before further selected choices are cut off.
       *
       * Only applicable when `multiple` is `true`.
       *
       * @defaultValue 3
       */
      display_items?: number;

      /**
       * Specifies the maximum amount of choices that should be shown when the
       * dropdown is open. If the amount of available choices exceeds this
       * number, the dropdown area must be scrolled to reach further items.
       *
       * If set to `-1`, the dropdown menu will attempt to show all choice
       * values and only resort to scrolling if the amount of choices exceeds
       * the available screen space above and below the dropdown widget.
       *
       * @defaultValue -1
       */
      dropdown_items?: number;

      /**
       * This property serves as a shortcut to set both `select_placeholder` and
       * `custom_placeholder`. Either of these properties will fallback to
       * `placeholder` if not specified.
       */
      placeholder?: string;

      /**
       * Specifies whether the custom choice input field should be rendered
       * readonly. Only applicable when `create` is `true`.
       *
       * @defaultValue false
       */
      readonly?: boolean;

      /**
       * Specifies the HTML `maxlength` attribute to set on the custom choice
       * `<input>` element. Note that this a legacy property that exists for
       * compatibility reasons. It is usually better to `maxlength(N)`
       * validation expression. Only applicable when `create` is `true`.
       */
      maxlength?: number;
    }
  }

  /**
   * The `DynamicList` class implements a widget which allows the user to
   * specify an arbitrary amount of input values, either from free formed text
   * input or from a set of predefined choices.
   *
   * UI widget instances are usually not supposed to be created by view code
   * directly, instead they're implicitely created by `LuCI.form` when
   * instantiating CBI forms.
   *
   * This class is automatically instantiated as part of `LuCI.ui`. To use it in
   * views, use `'require ui'` and refer to `ui.DynamicList`. To import it in
   * external JavaScript, use `L.require("ui").then(...)` and access the
   * `DynamicList` property of the class instance value.
   */
  class DynamicList extends AbstractElement {
    /**
     * Instantiate a dynamic list widget.
     *
     * @param value - The initial input value(s).
     * @param choices - Object containing the selectable choices of the widget.
     * The object keys serve as values for the different choices while the
     * values are used as choice labels. If omitted, no default choices are
     * presented to the user, instead a plain text input field is rendered
     * allowing the user to add arbitrary values to the dynamic list.
     * @param options - Object describing the widget specific options to
     * initialize the dynamic list.
     */
    constructor(
      value: string | string[] | null,
      choices?: { [key: string]: any },
      options?: DynamicList.InitOptions
    );

    /**
     * Add new suggested choices to the dynamic list.
     *
     * This function adds further choices to an existing dynamic list, ignoring
     * choice values which are already present.
     *
     * @param values - The choice values to add to the dynamic lists suggestion
     * dropdown.
     * @param labels - The choice label values to use when adding suggested
     * choices. If no label is found for a particular choice value, the value
     * itself is used as label text. Choice labels may be any valid value
     * accepted by `LuCI.dom#content`.
     */
    addChoices(values: string[], labels: { [key: string]: any }): void;

    /**
     * Remove all existing choices from the dynamic list.
     *
     * This function removes all preexisting suggested choices from the widget.
     */
    clearChoices(): void;
  }

  namespace DynamicList {
    /**
     * In case choices are passed to the dynamic list contructor, the widget
     * supports the same properties as `Dropdown.InitOptions` but enforces
     * specific values for some dropdown properties.
     */
    interface InitOptions extends Dropdown.InitOptions {
      /**
       * Since dynamic lists never allow selecting multiple choices when adding
       * another list item, this property is forcibly set to `false`.
       *
       * @defaultValue false
       */
      multiple: false;

      /**
       * Since dynamic lists use an embedded dropdown to present a list of
       * predefined choice values, the dropdown must be made optional to allow
       * it to remain unselected.
       *
       * @defaultValue true
       */
      optional?: boolean;
    }
  }

  /**
   * The `FileUpload` class implements a widget which allows the user to upload,
   * browse, select and delete files beneath a predefined remote directory.
   *
   * UI widget instances are usually not supposed to be created by view code
   * directly, instead they're implicitely created by `LuCI.form` when
   * instantiating CBI forms.
   *
   * This class is automatically instantiated as part of `LuCI.ui`. To use it in
   * views, use `'require ui'` and refer to `ui.FileUpload`. To import it in
   * external JavaScript, use `L.require("ui").then(...)` and access the
   * `FileUpload` property of the class instance value.
   */
  class FileUpload extends AbstractElement {
    /**
     * Instantiate a file upload widget.
     *
     * @param value - The initial input value.
     * @param options - Object describing the widget specific options to
     * initialize the file upload control.
     */
    constructor(
      value: string | string[] | null,
      options?: FileUpload.InitOptions
    );
  }

  namespace FileUpload {
    interface InitOptions extends AbstractElement.InitOptions {
      /**
       * Specifies whether hidden files should be displayed when browsing remote
       * files. Note that this is not a security feature, hidden files are
       * always present in the remote file listings received, this option merely
       * controls whether they're displayed or not.
       *
       * @defaultValue false
       */
      show_hidden?: boolean;

      /**
       * Specifies whether the widget allows the user to upload files. If set to
       * `false`, only existing files may be selected. Note that this is not a
       * security feature. Whether file upload requests are accepted remotely
       * depends on the ACL setup for the current session. This option merely
       * controls whether the upload controls are rendered or not.
       *
       * @defaultValue true
       */
      enable_upload?: boolean;

      /**
       * Specifies whether the widget allows the user to delete remove files. If
       * set to `false`, existing files may not be removed. Note that this is
       * not a security feature. Whether file delete requests are accepted
       * remotely depends on the ACL setup for the current session. This option
       * merely controls whether the file remove controls are rendered or not.
       *
       * @defaultValue true
       */
      enable_remove?: boolean;

      /**
       * Specifies the remote directory the upload and file browsing actions
       * take place in. Browsing to directories outside of the root directory is
       * prevented by the widget. Note that this is not a security feature.
       * Whether remote directories are browseable or not solely depends on the
       * ACL setup for the current session.
       *
       * @defaultValue /etc/luci-uploads
       */
      root_directory?: string;
    }
  }

  /**
   * The `Hiddenfield` class implements an HTML `<input type="hidden">` field
   * which allows to store form data without exposing it to the user.
   *
   * UI widget instances are usually not supposed to be created by view code
   * directly, instead they're implicitely created by `LuCI.form` when
   * instantiating CBI forms.
   *
   * This class is automatically instantiated as part of `LuCI.ui`. To use it in
   * views, use `'require ui'` and refer to `ui.Hiddenfield`. To import it in
   * external JavaScript, use `L.require("ui").then(...)` and access the
   * `Hiddenfield` property of the class instance value.
   */
  class Hiddenfield extends AbstractElement {
    /**
     * Instantiate a hidden input field widget.
     *
     * @param value - The initial input value.
     * @param options - Object describing the widget specific options to
     * initialize the hidden input.
     */
    constructor(
      value: string | string[] | null,
      options?: AbstractElement.InitOptions
    );
  }

  /**
   * Handle menu.
   */
  namespace menu {
    /**
     * Load and cache current menu tree.
     *
     * @returns Returns a promise resolving to the root element of the menu
     * tree.
     */
    function load(): Promise<MenuNode>;

    /**
     * Flush the internal menu cache to force loading a new structure on the
     * next page load.
     */
    function flushCache(): void;

    /**
     * Get menu children
     *
     * @param node - The menu node to retrieve the children for. Defaults to the
     * menu's internal root node if omitted.
     *
     * @returns Returns an array of child menu nodes.
     */
    function getChildren(node?: MenuNode): MenuNode[];

    type MenuNode = {
      /**
       * The internal name of the node, as used in the URL
       */
      name: string;

      /**
       * The sort index of the menu node
       */
      order: number;

      /**
       * The title of the menu node, `null` if the node should be hidden
       */
      title?: string | null;

      /**
       * Boolean indicating whether the menu enries dependencies are satisfied
       */
      satisified: boolean;

      /**
       * Boolean indicating whether the menu entries underlying ACLs are
       * readonly
       */
      readonly?: boolean;

      /**
       * Array of child menu nodes.
       */
      children?: MenuNode[];
    };
  }

  /**
   * The `Select` class implements either a traditional HTML `<select>` element
   * or a group of checkboxes or radio buttons, depending on whether multiple
   * values are enabled or not.
   *
   * UI widget instances are usually not supposed to be created by view code
   * directly, instead they're implicitely created by `LuCI.form` when
   * instantiating CBI forms.
   *
   * This class is automatically instantiated as part of `LuCI.ui`. To use it in
   * views, use `'require ui'` and refer to `ui.Select`. To import it in
   * external JavaScript, use `L.require("ui").then(...)` and access the
   * `Select` property of the class instance value.
   */
  class Select extends AbstractElement {
    /**
     * Instantiate a select dropdown or checkbox/radiobutton group.
     *
     * @param value - The initial input value(s).
     * @param choices - Object containing the selectable choices of the widget.
     * The object keys serve as values for the different choices while the
     * values are used as choice labels.
     * @param options - Object describing the widget specific options to
     * initialize the inputs.
     */
    constructor(
      value: string | string[] | null,
      choices: { [key: string]: string },
      options?: Select.InitOptions
    );
  }

  namespace Select {
    interface InitOptions extends AbstractElement.InitOptions {
      /**
       * Specifies whether multiple choice values may be selected.
       *
       * @defaultValue false
       */
      multiple?: boolean;

      /**
       * Specifies the kind of widget to render. May be either `select` or
       * `individual`. When set to `select` an HTML `<select>` element will be
       * used, otherwise a group of checkbox or radio button elements is
       * created, depending on the value of the `multiple` option.
       *
       * @defaultValue select
       */
      widget?: string;

      /**
       * Specifies whether checkbox / radio button groups should be rendered in
       * a `horizontal` or `vertical` manner. Does not apply to the `select`
       * widget type.
       *
       * @defaultValue horizontal
       */
      orientation?: string;

      /**
       * Specifies if and how to sort choice values. If set to `true`, the
       * choice values will be sorted alphabetically. If set to an array of
       * strings, the choice sort order is derived from the array.
       *
       * @defaultValue false
       */
      sort?: boolean | string[];

      /**
       * Specifies the HTML `size` attribute to set on the `<select>` element.
       * Only applicable to the `select` widget type.
       */
      size?: number;

      /**
       * Specifies a placeholder text which is displayed when no choice is
       * selected yet. Only applicable to the `select` widget type.
       *
       * @defaultValue `-- Please choose --`
       */
      placeholder?: string;
    }
  }

  /**
   * The `tabs` class handles tab menu groups used throughout the view area. It
   * takes care of setting up tab groups, tracking their state and handling
   * related events.
   *
   * This class is automatically instantiated as part of `LuCI.ui`. To use it in
   * views, use `'require ui'` and refer to `ui.tabs`. To import it in external
   * JavaScript, use `L.require("ui").then(...)` and access the `tabs` property
   * of the class instance value.
   */
  class tabs extends AbstractElement {
    /**
     * Initializes a new tab group from the given tab pane collection.
     *
     * This function cycles through the given tab pane DOM nodes, extracts their
     * tab IDs, titles and active states, renders a corresponding tab menu and
     * prepends it to the tab panes common parent DOM node.
     *
     * The tab menu labels will be set to the value of the `data-tab-title`
     * attribute of each corresponding pane. The last pane with the
     * `data-tab-active` attribute set to `true` will be selected by default.
     *
     * If no pane is marked as active, the first one will be preselected.
     *
     * @param panes - A collection of tab panes to build a tab group menu for.
     * May be a plain array of DOM nodes or a NodeList collection, such as the
     * result of a `querySelectorAll()` call or the `.childNodes` property of a
     * DOM node.
     */
    initTabGroup(panes: Node[] | NodeList): void;

    /**
     * Checks whether the given tab pane node is empty.
     *
     * @param pane - The tab pane to check.
     *
     * @returns Returns `true` if the pane is empty, else `false`.
     */
    isEmptyPane(pane: Node): boolean;
  }

  /**
   * The `Textarea` class implements a multiline text area input field.
   *
   * UI widget instances are usually not supposed to be created by view code
   * directly, instead they're implicitely created by `LuCI.form` when
   * instantiating CBI forms.
   *
   * This class is automatically instantiated as part of `LuCI.ui`. To use it in
   * views, use `'require ui'` and refer to `ui.Textarea`. To import it in
   * external JavaScript, use `L.require("ui").then(...)` and access the
   * `Textarea` property of the class instance value.
   */
  class Textarea extends AbstractElement {
    /**
     * Instantiate a textarea widget.
     *
     * @param value - The initial input value.
     * @param options - Object describing the widget specific options to
     * initialize the input.
     */
    constructor(value: string | null, options?: Textarea.InitOptions);
  }

  namespace Textarea {
    interface InitOptions extends AbstractElement.InitOptions {
      /**
       * Specifies whether the input widget should be rendered readonly.
       *
       * @defaultValue false
       */
      readonly?: boolean;

      /**
       * Specifies the HTML `placeholder` attribute which is displayed when the
       * corresponding `<textarea>` element is empty.
       */
      placeholder?: string;

      /**
       * Specifies whether a monospace font should be forced for the textarea
       * contents.
       *
       * @defaultValue false
       */
      monospace?: boolean;

      /**
       * Specifies the HTML `cols` attribute to set on the corresponding
       * `<textarea>` element.
       */
      cols?: number;

      /**
       * Specifies the HTML `rows` attribute to set on the corresponding
       * `<textarea>` element.
       */
      rows?: number;

      /**
       * Specifies whether the HTML `wrap` attribute should be set.
       *
       * @defaultValue false
       */
      wrap?: boolean;
    }
  }

  /**
   * The `Textfield` class implements a standard single line text input field.
   *
   * UI widget instances are usually not supposed to be created by view code
   * directly, instead they're implicitely created by `LuCI.form` when
   * instantiating CBI forms.
   *
   * This class is automatically instantiated as part of `LuCI.ui`. To use it in
   * views, use `'require ui'` and refer to `ui.Textfield`. To import it in
   * external JavaScript, use `L.require("ui").then(...)` and access the
   * `Textfield` property of the class instance value.
   */
  class Textfield extends AbstractElement {
    /**
     * Instantiate a text input widget.
     *
     * @param value - The initial input value.
     * @param options - Object describing the widget specific options to
     * initialize the input.
     */
    constructor(value: string | null, options?: Textfield.InitOptions);
  }

  namespace Textfield {
    interface InitOptions extends AbstractElement.InitOptions {
      /**
       * Specifies whether the input should be rendered as concealed password
       * field.
       *
       * @defaultValue false
       */
      password?: boolean;

      /**
       * Specifies whether the input widget should be rendered readonly.
       *
       * @defaultValue false
       */
      readonly?: boolean;

      /**
       * Specifies the HTML `maxlength` attribute to set on the corresponding
       * `<input>` element. Note that this a legacy property that exists for
       * compatibility reasons. It is usually better to `maxlength(N)`
       * validation expression.
       */
      maxlength?: number;

      /**
       * Specifies the HTML `placeholder` attribute which is displayed when the
       * corresponding `<input>` element is empty.
       */
      placeholder?: string;
    }
  }

  type FileUploadReply = {
    /**
     * Name of the uploaded file without directory components
     */
    name: string;

    /**
     * Size of the uploaded file in bytes
     */
    size: number;

    /**
     * The MD5 checksum of the received file data
     */
    checksum: string;

    /**
     * The SHA256 checksum of the received file data
     */
    sha256sum: string;
  };
}
