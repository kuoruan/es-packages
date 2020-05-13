// Type definitions for LuCI.form
// Documentation: http://openwrt.github.io/luci/jsapi/LuCI.form.html
// Definitions by: Xingwang Liao <https://github.com/kuoruan>
// TypeScript Version: 3.8

import baseclass from "./baseclass";

export as namespace form;
export = form;

/**
   * The LuCI form class provides high level abstractions for creating creating UCI- or JSON backed configurations forms.
   *
   * To import the class in views, use `'require form'`, to import it in external JavaScript, use `L.require("form").then(...)`.
   *
   * A typical form is created by first constructing a `LuCI.form.Map` or `LuCI.form.JSONMap` instance using `new` and by subsequently adding sections and options to it. Finally `render()` is invoked on the instance to assemble the HTML markup and insert it into the DOM.
   *
   * Example:
   * ```js
   * 'use strict';
   * 'require form';
   *
   * var m, s, o;

   * m = new form.Map('example', 'Example form',
   *	'This is an example form mapping the contents of /etc/config/example');
   *
   * s = m.section(form.NamedSection, 'first_section', 'example', 'The first section',
   * 	'This sections maps "config example first_section" of /etc/config/example');
   *
   * o = s.option(form.Flag, 'some_bool', 'A checkbox option');
   *
   * o = s.option(form.ListValue, 'some_choice', 'A select element');
   * o.value('choice1', 'The first choice');
   * o.value('choice2', 'The second choice');
   *
   * m.render().then(function(node) {
   * 	document.body.appendChild(node);
   * });
   * ```
   */
declare class form extends baseclass {}

declare namespace form {
  /**
   * The `AbstractElement` class serves as abstract base for the different form elements implemented by `LuCI.form`. It provides the common logic for loading and rendering values, for nesting elements and for defining common properties.
   *
   * This class is private and not directly accessible by user code.
   */
  abstract class AbstractElement extends baseclass {
    /**
     * Add another form element as children to this element.
     *
     * @param element - The form element to add.
     */
    append<T extends AbstractElement>(element: T): void;

    /**
     * Parse this elements form input.
     *
     * `The parse()` function recursively walks the form element tree and triggers input value reading and validation for each encountered element.
     *
     * Elements which are hidden due to unsatisified dependencies are skipped.
     *
     * @returns Returns a promise resolving once this element's value and the values of all child elements have been parsed. The returned promise is rejected if any parsed values are not meeting the validation constraints of their respective elements.
     */
    parse(): Promise<void>;

    /**
     * Render the form element.
     *
     * The `render()` function recursively walks the form element tree and renders the markup for each element, returning the assembled DOM tree.
     *
     * @returns May return a DOM Node or a promise resolving to a DOM node containing the form element's markup, including the markup of any child elements.
     */
    abstract render(): Node | Promise<Node>;

    /**
     * Strip any HTML tags from the given input string.
     *
     * @param input - The input string to clean.
     *
     * @returns The cleaned input string with HTML removes removed.
     */
    stripTags(input: string): string;

    /**
     * Format the given named property as title string.
     *
     * This function looks up the given named property and formats its value suitable for use as element caption or description string. It also strips any HTML tags from the result.
     *
     * If the property value is a string, it is passed to `String.format()` along with any additional parameters passed to `titleFn()`.
     *
     * If the property value is a function, it is invoked with any additional `titleFn()` parameters as arguments and the obtained return value is converted to a string.
     *
     * In all other cases, `null` is returned.
     *
     * @param property - The name of the element property to use.
     * @param fmt_args - repeatable. Extra values to format the title string with.
     *
     * @returns The formatted title string or `null` if the property did not exist or was neither a string nor a function.
     */
    titleFn(property: string, ...fmt_args: any[]): string | null;
  }

  /**
   * The `AbstractSection` class serves as abstract base for the different form section styles implemented by `LuCI.form`. It provides the common logic for enumerating underlying configuration section instances, for registering form options and for handling tabs to segment child options.
   *
   * This class is private and not directly accessible by user code.
   */
  abstract class AbstractSection extends AbstractElement {
    /**
     * Access the parent option container instance.
     *
     * In case this section is nested within an option element container, this property will hold a reference to the parent option instance.
     *
     * If this section is not nested, the property is `null`.
     */
    readonly parentoption: AbstractValue<any>;

    /**
     * Enumerate the UCI section IDs covered by this form section element.
     *
     * @throws Throws an {@link InternalError} exception if the function is not implemented.
     *
     * @returns Returns an array of UCI section IDs covered by this form element. The sections will be rendered in the same order as the returned array.
     */
    abstract cfgsections(): string[];

    abstract filter(section_id: string): boolean;

    load(): Promise<void>;

    option<T = string>(
      optionclass: AbstractValue<T>,
      ...classargs: any[]
    ): AbstractValue<T>;

    parse(): Promise<void>;

    tab(name: string, title: string, description: string): void;

    taboption<T = string>(
      tabname: string,
      optionclass: AbstractValue<T>,
      ...classargs: any[]
    ): AbstractValue<T>;
  }

  abstract class AbstractValue<T = string> extends AbstractElement {
    datatype: LuCI.validation.DataTypes;

    default: T;

    editable: boolean;

    modalonly: boolean;

    optional: boolean;

    readonly: boolean;

    rmempty: boolean;

    uciconfig: string;

    ucioption: string;

    ucisection: string;

    width: number | string;

    cbid(section_id: string): string;

    cfgvalue(section_id: string): T;

    depends(
      optionname_or_depends: string | { [key: string]: string | boolean },
      optionvalue: string
    ): void;

    formvalue(section_id: string): T;

    getUIElement(section_id: string): ui.AbstractElement | null;

    isActive(section_id: string): boolean;

    isValid(section_id: string): boolean;

    load(section_id: string): Promise<any> | Promise<any>[];

    parse(section_id?: string): Promise<void>;

    remove(section_id: string): void;

    textvalue(section_id: string): string;

    abstract validate(section_id: string, value: T): any;

    write(section_id: string, formvalue: string | string[]): void;
  }

  class ButtonValue<T> extends Value<T> {
    inputstyle: string;

    inputtitle: string | Function;

    onclick: Function;
  }

  class DummyValue<T> extends Value<T> {
    href: string;

    rawhtml: boolean;
  }

  class DynamicList<T> extends Value<T> {}

  class FileUpload extends Value<string> {
    enable_remove: boolean;

    enable_upload: boolean;

    root_directory: string;

    show_hidden: boolean;
  }

  class Flag extends Value<number> {
    disabled: number;

    enabled: number;
  }

  abstract class GridSection extends TableSection {
    tab(name: string, title: string, description?: string): void;
  }

  class HiddenValue<T = string> extends Value<T> {}

  class JSONMap extends Map {}

  class ListValue extends Value<string[]> {
    size: number;
  }

  class Map extends AbstractElement {
    readonly: boolean;

    constructor(config: string, title?: string, description?: string);

    chain(config: string): void;

    findElement(selector_or_attrname: string, attrvalue: string): Node | null;

    findElements(selector_or_attrname: string, attrvalue: string): NodeList;

    load(): Promise<void>;

    lookupOption<T extends AbstractValue<any>>(
      name_or_id: string,
      section_id: string,
      config: string
    ): T[] | string[] | null;

    parse(): Promise<void>;

    render(): Promise<Node>;

    reset(): Promise<Node>;

    save(cb: Function, silent: boolean): Promise<void>;

    section<S extends AbstractSection = AbstractSection>(
      sectionclass: S,
      classargs: string
    ): S;
  }

  class MultiValue extends DynamicList<string[]> {
    display_size: number;

    dropdown_size: number;
  }

  abstract class NamedSection extends AbstractSection {}

  class SectionValue<
    T = string,
    S extends AbstractSection = AbstractSection,
    E extends AbstractSection = AbstractSection
  > extends Value<T, S> {
    constructor(
      form: Map | JSONMap,
      section: S,
      option: string,
      subsection_class: E,
      ...class_args: any[]
    );

    readonly subsection: E;
  }

  abstract class TableSection extends TypedSection {
    extedit: string | Function;

    max_cols: number;

    modaltitle: string;

    rowcolors: boolean;

    sectiontitle: string | Function;

    sortable: boolean;

    abstract addModalOptions(
      modalSection: NamedSection,
      section_id: string,
      ev: Event
    ): any | Promise<any>;
  }

  class TextValue extends Value<string> {
    cols: number;

    monospace: boolean;

    rows: number;

    wrap: number;
  }

  abstract class TypedSection extends AbstractSection {
    addbtntitle: string | Function;

    addremove: boolean;

    anonymous: boolean;

    tabbed: boolean;

    uciconfig: string;

    render(): Node | Promise<Node>;

    cfgsections(): string[];

    constructor(
      form: Map | JSONMap,
      section_type: string,
      title?: string,
      description?: string
    );
  }

  class Value<
    T,
    S extends AbstractSection = AbstractSection
  > extends AbstractValue<T> {
    password: boolean;

    placeholder: string;

    constructor(
      form: Map | JSONMap,
      section: S,
      option: string,
      title?: string,
      description?: string
    );

    validate: (section_id: string, value: T) => any;

    render(): Node | Promise<Node>;

    value(key: string, value: Node | string): void;
  }
}
