// Type definitions for LuCI.ui
// Documentation: http://openwrt.github.io/luci/jsapi/LuCI.ui.html
// Definitions by: Xingwang Liao <https://github.com/kuoruan>
// TypeScript Version: 3.8

import baseclass from "./baseclass";
import validation from "./validation";

export as namespace ui;
export = ui;

/**
 * Provides high level UI helper functionality. To import the class in views, use `'require ui'`, to import it in external JavaScript, use `L.require("ui").then(...)`.
 */
declare namespace ui {
  /**
   * Add a notification banner at the top of the current view.
   *
   * A notification banner is an alert message usually displayed at the top of the current view, spanning the entire availibe width. Notification banners will stay in place until dismissed by the user. Multiple banners may be shown at the same time.
   *
   * Additional CSS class names may be passed to influence the appearence of the banner. Valid values for the classes depend on the underlying theme.
   *
   * @see {@link LuCI.dom.content}
   *
   * @param title - The title of the notification banner. If `null`, no title element will be rendered.
   * @param contents - The contents to add to the notification banner. This should be a DOM node or a document fragment in most cases. The value is passed as-is to the `dom.content()` function - refer to its documentation for applicable values.
   * @param classes - repeatable. A number of extra CSS class names which are set on the notification banner element.
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
   * Compile the given type expression and optional validator function into a validation function and bind it to the specified input element events.
   *
   * @see {@link LuCI.validation}
   *
   * @param field - The DOM input element node to bind the validation constraints to.
   * @param type - The datatype specification to describe validation constraints. Refer to the `LuCI.validation` class documentation for details.
   * @param optional - Specifies whether empty values are allowed (`true`) or not (`false`). If an input element is not marked optional it must not be empty, otherwise it will be marked as invalid.
   * @param vfunc - Specifies a custom validation function which is invoked after the other validation constraints are applied. The validation must return `true` to accept the passed value. Any other return type is converted to a string and treated as validation error message.
   * @param events - repeatable. The list of events to bind. Each received event will trigger a field validation. If omitted, the `keyup` and `blur` events are bound by default.
   *
   * @returns Returns the compiled validator function which can be used to manually trigger field validation or to bind it to further events.
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
   * Poll each given hostname or IP address and navigate to it as soon as one of the addresses becomes reachable.
   *
   * @param hosts - repeatable. The list of IP addresses and host names to check for reachability. If omitted, the current value of `window.location.host` is used by default.
   */
  function awaitReconnect(...hosts: string[]): void;

  /**
   * Create a pre-bound event handler function.
   *
   * Generate and bind a function suitable for use in event handlers. The generated function automatically disables the event source element and adds an active indication to it by adding appropriate CSS classes.
   *
   * It will also await any promises returned by the wrapped function and re-enable the source element after the promises ran to completion.
   *
   * @param ctx - The `this` context to use for the wrapped function.
   * @param fn - Specifies the function to wrap. In case of a function value, the function is used as-is. If a string is specified instead, it is looked up in `ctx` to obtain the function to wrap. In both cases the bound function will be invoked with `ctx` as `this` context
   * @param extra_args - repeatable. Any further parameter as passed as-is to the bound event handler function in the same order as passed to `createHandlerFn()`.
   *
   * @returns Returns the pre-bound handler function which is suitable to be passed to `addEventListener()`. Returns `null` if the given `fn` argument is a string which could not be found in `ctx` or if `ctx[fn]` is not a valid function value.
   */
  function createHandlerFn(
    ctx: any,
    fn: Function | string,
    ...extra_args: any[]
  ): Function | null;

  /**
   * Remove an header area indicator.
   *
   * This function removes the given indicator label from the header indicator area. When the given indicator is not found, this function does nothing.
   *
   * @param id - The ID of the indicator to remove.
   *
   * @returns Returns `true` when the indicator has been removed or `false` when the requested indicator was not found.
   */
  function hideIndicator(id: string): boolean;

  /**
   * Close the open modal overlay dialog.
   *
   * This function will close an open modal dialog and restore the normal view behaviour. It has no effect if no modal dialog is currently open.
   *
   * Note that this function is stand-alone, it does not rely on this and will not invoke other class functions so it suitable to be used as event handler as-is without the need to bind it first.
   */
  function hideModal(): void;

  /**
   * Load specified view class path and set it up.
   *
   * Transforms the given view path into a class name, requires it using `LuCI.require()` and asserts that the resulting class instance is a descendant of `LuCI.view`.
   *
   * By instantiating the view class, its corresponding contents are rendered and included into the view area. Any runtime errors are catched and rendered using `LuCI.error()`.
   *
   * @param path - The view path to render.
   *
   * @returns Returns a promise resolving to the loaded view instance.
   */
  function instantiateView(path: string): Promise<LuCI.view>;

  /**
   * Formats a series of label/value pairs into list-like markup.
   *
   * This function transforms a flat array of alternating label and value elements into a list-like markup, using the values in `separators` as separators and appends the resulting nodes to the given parent DOM node.
   *
   * Each label is suffixed with `:` and wrapped into a `<strong>` tag, the `<strong>` element and the value corresponding to the label are subsequently wrapped into a `<span class="nowrap">` element.
   *
   * The resulting `<span>` element tuples are joined by the given separators to form the final markup which is appened to the given parent DOM node.
   *
   * @param node - The parent DOM node to append the markup to. Any previous child elements will be removed.
   * @param items - An alternating array of labels and values. The label values will be converted to plain strings, the values are used as-is and may be of any type accepted by `LuCI.dom.content()`.
   * @param separators - A single value or an array of separator values to separate each label/value pair with. The function will cycle through the separators when joining the pairs. If omitted, the default separator is a sole HTML `<br>` element. Separator values are used as-is and may be of any type accepted by `LuCI.dom.content()`.
   *
   * @returns Returns the parent DOM node the formatted markup has been added to.
   */
  function itemlist(node: Node, items: any[], separators?: any | any[]): Node;

  /**
   * Perform a device connectivity test.
   *
   * Attempt to fetch a well known ressource from the remote device via HTTP in order to test connectivity. This function is mainly useful to wait for the router to come back online after a reboot or reconfiguration.
   *
   * @param proto - The protocol to use for fetching the resource. May be either `http` (the default) or `https`.
   * @param host - Override the host address to probe. By default the current host as seen in the address bar is probed.
   *
   * @returns Returns a promise resolving to a `load` event in case the device is reachable or rejecting with an `error` event in case it is not reachable or rejecting with `null` when the connectivity check timed out.
   */
  function pingDevice(proto?: "http" | "https", host?: string): Promise<Event>;

  /**
   * Display or update an header area indicator.
   *
   * An indicator is a small label displayed in the header area of the screen providing few amounts of status information such as item counts or state toggle indicators.
   *
   * Multiple indicators may be shown at the same time and indicator labels may be made clickable to display extended information or to initiate further actions.
   *
   * Indicators can either use a default `active` or a less accented `inactive` style which is useful for indicators representing state toggles.
   *
   * @param id - The ID of the indicator. If an indicator with the given ID already exists, it is updated with the given label and style.
   * @param label - The text to display in the indicator label.
   * @param handler - A handler function to invoke when the indicator label is clicked/touched by the user. If omitted, the indicator is not clickable/touchable.
   *
   * Note that this parameter only applies to new indicators, when updating existing labels it is ignored.
   * @param style - The indicator style to use. May be either `active` or `inactive`.
   *
   * @returns Returns `true` when the indicator has been updated or `false` when no changes were made.
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
   * The modal overlay dialog covers the current view preventing interaction with the underlying view contents. Only one modal dialog instance can be opened. Invoking showModal() while a modal dialog is already open will replace the open dialog with a new one having the specified contents.
   *
   * Additional CSS class names may be passed to influence the appearence of the dialog. Valid values for the classes depend on the underlying theme.
   *
   * @see {@link LuCI.dom.content}
   *
   * @param title - The title of the dialog. If `null`, no title element will be rendered.
   * @param contents - The contents to add to the modal dialog. This should be a DOM node or a document fragment in most cases. The value is passed as-is to the `dom.content()` function - refer to its documentation for applicable values.
   * @param classes - repeatable. A number of extra CSS class names which are set on the modal dialog element.
   *
   * @returns Returns a DOM Node representing the modal dialog element.
   */
  function showModal(title: string | null, contents: any, ...classes: string[]): Node;

  /**
   * Display a modal file upload prompt.
   *
   * This function opens a modal dialog prompting the user to select and upload a file to a predefined remote destination path.
   *
   * @param path - The remote file path to upload the local file to.
   * @param progessStatusNode - An optional DOM text node whose content text is set to the progress percentage value during file upload.
   *
   * @returns Returns a promise resolving to a file upload status object on success or rejecting with an error in case the upload failed or has been cancelled by the user.
   */
  function uploadFile(
    path: string,
    progessStatusNode?: Node
  ): Promise<FileUploadReply>;

  /**
   * The `AbstractElement` class serves as abstract base for the different widgets implemented by `LuCI.ui`. It provides the common logic for getting and setting values, for checking the validity state and for wiring up required events.
   *
   * UI widget instances are usually not supposed to be created by view code directly, instead they're implicitely created by `LuCI.form` when instantiating CBI forms.
   *
   * This class is automatically instantiated as part of `LuCI.ui`. To use it in views, use `'require ui'` and refer to `ui.AbstractElement`. To import it in external JavaScript, use `L.require("ui").then(...)` and access the `AbstractElement` property of the class instance value.
   */
  class AbstractElement extends baseclass {
    /**
     * Read the current value of the input widget.
     *
     * @returns The current value of the input element. For simple inputs like text fields or selects, the return value type will be a - possibly empty - string. Complex widgets such as `DynamicList` instances may result in an array of strings or `null` for unset values.
     */
    getValue(): string | string[] | null;

    /**
     * Check whether the current input value is valid.
     *
     * @returns Returns `true` if the current input value is valid or `false` if it does not meet the validation constraints.
     */
    isValid(): boolean;

    /**
     * Dispatch a custom (synthetic) event in response to received events.
     *
     * Sets up event handlers on the given target DOM node for the given event names that dispatch a custom event of the given type to the widget root DOM node.
     *
     * The primary purpose of this function is to set up a series of custom uniform standard events such as widget-update, validation-success, validation-failure etc. which are triggered by various different widget specific native DOM events.
     *
     * @param targetNode - Specifies the DOM node on which the native event listeners should be registered.
     * @param synevent - The name of the custom event to dispatch to the widget root DOM node.
     * @param events - The native DOM events for which event handlers should be registered.
     */
    registerEvents(targetNode: Node, synevent: string, events: string[]): void;

    /**
     * Render the widget, setup event listeners and return resulting markup.
     *
     * @returns Returns a DOM Node or DocumentFragment containing the rendered widget markup.
     */
    render(): Node;

    /**
     * Setup listeners for native DOM events that may change the widget value.
     *
     * Sets up event handlers on the given target DOM node for the given event names which may cause the input value to change completely, such as `change` events in a select menu. In contrast to update events, such change events will not trigger input value validation but they may cause field dependencies to get re-evaluated and will mark the input widget as dirty.
     *
     * @param targetNode - Specifies the DOM node on which the event listeners should be registered.
     * @param events - repeatable. The DOM events for which event handlers should be registered.
     */
    setChangeEvents(targetNode: Node, ...events: string[]): void;

    /**
     * Setup listeners for native DOM events that may update the widget value.
     *
     * Sets up event handlers on the given target DOM node for the given event names which may cause the input value to update, such as `keyup` or `onclick` events. In contrast to change events, such update events will trigger input value validation.
     *
     * @param targetNode - Specifies the DOM node on which the event listeners should be registered.
     * @param events - repeatable. The DOM events for which event handlers should be registered.
     */
    setUpdateEvents(targetNode: Node, ...events: string[]): void;

    /**
     * Set the current value of the input widget.
     *
     * @param value - The value to set the input element to. For simple inputs like text fields or selects, the value should be a - possibly empty - string. Complex widgets such as `DynamicList` instances may accept string array or `null` values.
     */
    setValue(value: string | string[] | null): void;

    /**
     * Force validation of the current input value.
     *
     * Usually input validation is automatically triggered by various DOM events bound to the input widget. In some cases it is required though to manually trigger validation runs, e.g. when programmatically altering values.
     */
    triggerValidation(): void;
  }

  namespace AbstractElement {
    interface InitOptions {
      /**
       * Specifies the widget ID to use. It will be used as HTML `id` attribute on the toplevel widget DOM node.
       */
      id?: string;

      /**
       * Specifies the widget `name` which is set as HTML name attribute on the corresponding `<input>` element.
       */
      name?: string;

      /**
       * Specifies whether the input field allows empty values.
       *
       * @defaultValue true
       */
      optional?: boolean;

      /**
       * An expression describing the input data validation constraints. It defaults to `string` which will allow any value. See `LuCI.validation` for details on the expression format.
       *
       * @defaultValue string
       */
      datatype?: string;

      /**
       * Specifies a custom validator function which is invoked after the standard validation constraints are checked. The function should return `true` to accept the given input value. Any other return value type is converted to a string and treated as validation error message.
       */
      validator?: Function;

      /**
       * Specifies whether the widget should be rendered in disabled state (`true`) or not (`false`). Disabled widgets cannot be interacted with and are displayed in a slightly faded style.
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
     * Start applying staged configuration changes and open a modal dialog with a progress indication to prevent interaction with the view during the apply process. The modal dialog will be automatically closed and the current view reloaded once the apply process is complete.
     *
     * @param checked - Whether to perform a checked (`true`) configuration apply or an unchecked (`false`) one. In case of a checked apply, the configuration changes must be confirmed within a specific time interval, otherwise the device will begin to roll back the changes in order to restore the previous settings.
     */
    function apply(checked?: boolean): void;

    /**
     * Display the current changelog.
     *
     * Open a modal dialog visualizing the currently staged UCI changes and offer options to revert or apply the shown changes.
     */
    function displayChanges(): void;

    /**
     * Update the change count indicator.
     *
     * This function updates the UCI change count indicator from the given UCI changeset structure.
     *
     * @param changes - The UCI changeset to count.
     */
    function renderChangeIndicator(changes: {
      [key: string]: LuCI.uci.ChangeRecord[];
    }): void;

    /**
     * Revert the staged configuration changes.
     *
     * Start reverting staged configuration changes and open a modal dialog with a progress indication to prevent interaction with the view during the revert process. The modal dialog will be automatically closed and the current view reloaded once the revert process is complete.
     */
    function revert(): void;

    /**
     * Set the change count indicator.
     *
     * This function updates or hides the UCI change count indicator, depending on the passed change count. When the count is greater than 0, the change indicator is displayed or updated, otherwise it is removed.
     *
     * @param numChanges - The number of changes to indicate.
     */
    function setIndicator(numChanges: number): void;
  }

  /**
   * The `Checkbox` class implements a simple checkbox input field.
   *
   * UI widget instances are usually not supposed to be created by view code directly, instead they're implicitely created by `LuCI.form` when instantiating CBI forms.
   *
   * This class is automatically instantiated as part of `LuCI.ui`. To use it in views, use `'require ui'` and refer to `ui.Checkbox`. To import it in external JavaScript, use `L.require("ui").then(...)` and access the `Checkbox` property of the class instance value.
   */
  class CheckBox extends AbstractElement {
    /**
     * Instantiate a checkbox widget.
     *
     * @param value - The initial input value.
     * @param options - Object describing the widget specific options to initialize the input.
     */
    constructor(value?: string, options?: CheckBox.InitOptions);

    /**
     * Test whether the checkbox is currently checked.
     *
     * @returns Returns `true` when the checkbox is currently checked, otherwise `false`.
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
       * Specifies the HTML `name` attribute of the hidden input backing the checkbox. This is a legacy property existing for compatibility reasons, it is required for HTML based form submissions.
       */
      hiddenname?: string;
    }
  }

  /**
   * The `Combobox` class implements a rich, stylable dropdown menu which allows to enter custom values. Historically, comboboxes used to be a dedicated widget type in LuCI but nowadays they are direct aliases of dropdown widgets with a set of enforced default properties for easier instantiation.
   *
   * UI widget instances are usually not supposed to be created by view code directly, instead they're implicitely created by `LuCI.form` when instantiating CBI forms
   *
   * This class is automatically instantiated as part of `LuCI.ui`. To use it in views, use `'require ui'` and refer to `ui.Combobox`. To import it in external JavaScript, use `L.require("ui").then(...)` and access the `Combobox` property of the class instance value.
   */
  class Combobox extends Dropdown {
    /**
     * Instantiate a rich dropdown choice widget allowing custom values.
     *
     * @param value - The initial input value(s).
     * @param choices - Object containing the selectable choices of the widget. The object keys serve as values for the different choices while the values are used as choice labels.
     * @param options - Object describing the widget specific options to initialize the dropdown.
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
       * Since Comboboxes never allow selecting multiple values, this property is forcibly set to `false`.
       */
      multiple: false;

      /**
       * Since Comboboxes always allow custom choice values, this property is forcibly set to `true`.
       */
      create: true;

      /**
       * Since Comboboxes are always optional, this property is forcibly set to `true`.
       */
      optional: true;
    }
  }

  class ComboButton extends Dropdown {
    constructor(
      value: string | string[],
      choices: { [key: string]: any },
      options: ComboButton.InitOptions
    );
  }

  namespace ComboButton {
    interface InitOptions extends Dropdown.InitOptions {
      multiple: boolean;

      create: boolean;

      optional: boolean;

      classes: { [key: string]: string };

      click: Function;
    }
  }

  class Dropdown extends AbstractElement {
    constructor(
      value: string | string[],
      choices: { [key: string]: any },
      options: Dropdown.InitOptions
    );

    addChoices(values: string[], labels: { [key: string]: any }): void;

    clearChoices(reset_value: boolean): void;

    closeAllDropdowns(): void;
  }

  namespace Dropdown {
    interface InitOptions {
      optional?: boolean;

      multiple?: boolean;

      sort?: boolean | string[];

      select_placeholder?: string;

      custom_placeholder?: string;

      create?: boolean;

      create_query?: string;

      create_template?: string;

      create_markup?: string;

      display_items?: number;

      dropdown_items?: number;

      placeholder?: string;

      readonly?: boolean;

      maxlength?: number;
    }
  }

  class DynamicList extends AbstractElement {
    constructor(
      value: string | string[],
      choices: { [key: string]: any },
      options: DynamicList.InitOptions
    );

    addChoices(values: string[], labels: { [key: string]: any }): void;
  }

  namespace DynamicList {
    interface InitOptions extends AbstractElement.InitOptions {
      /**
       * Since dynamic lists never allow selecting multiple choices when adding another list item, this property is forcibly set to `false`.
       *
       * @defaultValue false
       */
      multiple: false;

      /**
       * Since dynamic lists use an embedded dropdown to present a list of predefined choice values, the dropdown must be made optional to allow it to remain unselected.
       *
       * @defaultValue true
       */
      optional?: boolean;
    }
  }

  class FileUpload extends AbstractElement {
    constructor(value: string | string[], options: FileUpload.InitOptions);
  }

  namespace FileUpload {
    interface InitOptions extends AbstractElement.InitOptions {
      /**
       * Specifies whether hidden files should be displayed when browsing remote files. Note that this is not a security feature, hidden files are always present in the remote file listings received, this option merely controls whether they're displayed or not.
       *
       * @defaultValue false
       */
      show_hidden?: boolean;

      /**
       * Specifies whether the widget allows the user to upload files. If set to `false`, only existing files may be selected. Note that this is not a security feature. Whether file upload requests are accepted remotely depends on the ACL setup for the current session. This option merely controls whether the upload controls are rendered or not.
       *
       * @defaultValue true
       */
      enable_upload?: boolean;

      /**
       * Specifies whether the widget allows the user to delete remove files. If set to `false`, existing files may not be removed. Note that this is not a security feature. Whether file delete requests are accepted remotely depends on the ACL setup for the current session. This option merely controls whether the file remove controls are rendered or not.
       *
       * @defaultValue true
       */
      enable_remove?: boolean;

      /**
       * Specifies the remote directory the upload and file browsing actions take place in. Browsing to directories outside of the root directory is prevented by the widget. Note that this is not a security feature. Whether remote directories are browseable or not solely depends on the ACL setup for the current session.
       *
       * @defaultValue /etc/luci-uploads
       */
      root_directory?: string;
    }
  }

  class Hiddenfield extends AbstractElement {
    constructor(value: string | string[], options: AbstractElement.InitOptions);
  }

  /**
   * Handle menu.
   */
  namespace menu {
    /**
     * Load and cache current menu tree.
     *
     * @returns Returns a promise resolving to the root element of the menu tree.
     */
    function load(): Promise<MenuNode>;

    /**
     * Flush the internal menu cache to force loading a new structure on the next page load.
     */
    function flushCache(): void;

    /**
     * Get menu children
     *
     * @param node - The menu node to retrieve the children for. Defaults to the menu's internal root node if omitted.
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
       * Boolean indicating whether the menu entries underlying ACLs are readonly
       */
      readonly?: boolean;

      /**
       * Array of child menu nodes.
       */
      children?: MenuNode[];
    };
  }

  class Select extends AbstractElement {
    constructor(
      value: string | string[],
      choices: { [key: string]: string },
      options: Select.InitOptions
    );
  }

  namespace Select {
    interface InitOptions extends AbstractElement.InitOptions {
      multiple?: boolean;

      widget?: string;

      orientation?: string;

      sort?: boolean | string[];

      size?: number;

      placeholder?: string;
    }
  }

  class tabs extends AbstractElement {
    initTabGroup(panes: Node[] | NodeList): void;

    isEmptyPane(pane: Node): boolean;
  }

  class Textarea extends AbstractElement {
    constructor(value: string, options: Textarea.InitOptions);
  }

  namespace Textarea {
    interface InitOptions extends AbstractElement.InitOptions {
      /**
       * Specifies whether the input widget should be rendered readonly.
       *
       * @defaultValue false
       */
      readonly?: boolean;

      placeholder?: string;

      monospace?: boolean;

      cols?: number;

      rows?: number;

      wrap?: boolean;
    }
  }

  class Textfield extends AbstractElement {
    constructor(value: string, options: Textfield.InitOptions);
  }

  namespace Textfield {
    interface InitOptions extends AbstractElement.InitOptions {
      password?: boolean;

      readonly?: boolean;

      maxlength?: number;

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
