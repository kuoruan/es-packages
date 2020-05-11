// Type definitions for LuCI.ui
// Documentation: http://openwrt.github.io/luci/jsapi/LuCI.ui.html
// Definitions by: Xingwang Liao <https://github.com/kuoruan>
// TypeScript Version: 3.8

import baseclass from "./baseclass";

export as namespace ui;
export = ui;

/**
 * Provides high level UI helper functionality. To import the class in views, use `'require ui'`, to import it in external JavaScript, use `L.require("ui").then(...)`.
 */
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

  function awaitReconnect(...hosts: string[]): void;

  function createHandlerFn(
    ctx: any,
    fn: Function | string,
    ...extra_args: any[]
  ): Function | null;

  function hideIndicator(id: string): boolean;

  function hideModal(): void;

  function instantiateView(path: string): Promise<LuCI.view>;

  function itemlist(node: Node, items: any[], separators?: any | any[]): Node;

  function pingDevice(proto: string, host: string): Promise<Event>;

  function showIndicator(
    id: string,
    label: string,
    handler?: Function,
    style?: "active" | "inactive"
  ): boolean;

  function showModal(title: string, contents: any, classes: string): Node;

  function uploadFile(
    path: string,
    progessStatusNode?: Node
  ): Promise<FileUploadReply>;

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
    interface InitOptions {
      id: string;
      name: string;
      optional: boolean;
      datatype: string;
      validator: Function;
      disabled: boolean;
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

  class CheckBox extends AbstractElement {
    constructor(value: string, options: CheckBox.InitOptions);

    isChecked(): boolean;
  }

  namespace CheckBox {
    interface InitOptions extends AbstractElement.InitOptions {
      value_enabled: string;

      value_disabled: string;

      hiddenname: string;
    }
  }

  class Combobox extends Dropdown {
    constructor(
      value: string | string[],
      choices: { [key: string]: any },
      options: Combobox.InitOptions
    );
  }

  namespace Combobox {
    interface InitOptions extends Dropdown.InitOptions {
      multiple: boolean;

      create: boolean;

      optional: boolean;
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
      optional: boolean;

      multiple: boolean;

      sort: boolean | string[];

      select_placeholder: string;

      custom_placeholder: string;

      create: boolean;

      create_query: string;

      create_template: string;

      create_markup: string;

      display_items: number;

      dropdown_items: number;

      placeholder: string;

      readonly: boolean;

      maxlength: number;
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
      multiple: boolean;

      optional: boolean;
    }
  }

  class FileUpload extends AbstractElement {
    constructor(value: string | string[], options: FileUpload.InitOptions);
  }

  namespace FileUpload {
    interface InitOptions extends AbstractElement.InitOptions {
      show_hidden: boolean;

      enable_upload: boolean;

      enable_remove: boolean;

      root_directory: string;
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
      multiple: boolean;

      widget: string;

      orientation: string;

      sort: boolean | string[];

      size: number;

      placeholder: string;
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
      readonly: boolean;

      placeholder: string;

      monospace: boolean;

      cols: number;

      rows: number;

      wrap: boolean;
    }
  }

  class Textfield extends AbstractElement {
    constructor(value: string, options: Textfield.InitOptions);
  }

  namespace Textfield {
    interface InitOptions extends AbstractElement.InitOptions {
      password: boolean;

      readonly: boolean;

      maxlength: number;

      placeholder: string;
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
