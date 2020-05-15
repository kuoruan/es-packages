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
  class AbstractSection extends AbstractElement {
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
    cfgsections(): string[];

    /**
     * Filter UCI section IDs to render.
     *
     * The filter function is invoked for each UCI section ID of a given type and controls whether the given UCI section is rendered or ignored by the form section element.
     *
     * The default implementation always returns `true`. User code or classes extending `AbstractSection` may overwrite this function with custom implementations.
     *
     * @param section_id - The UCI section ID to test.
     *
     * @returns Returns `true` when the given UCI section ID should be handled and `false` when it should be ignored.
     */
    filter(section_id: string): boolean;

    /**
     * Load the configuration covered by this section.
     *
     * The `load()` function recursively walks the section element tree and invokes the load function of each child option element.
     *
     * @returns Returns a promise resolving once the values of all child elements have been loaded. The promise may reject with an error if any of the child elements load functions rejected with an error.
     */
    load(): Promise<void>;

    /**
     * Add a configuration option widget to the section.
     *
     * Note that taboption() should be used instead if this form section element uses tabs.
     *
     * @param optionclass - The option class to use for rendering the configuration option. Note that this value must be the class itself, not a class instance obtained from calling `new`. It must also be a class dervied from `LuCI.form.AbstractSection`.
     * @param classargs - repeatable. Additional arguments which are passed as-is to the contructor of the given option class. Refer to the class specific constructor documentation for details.
     *
     * @throws Throws a {@link TypeError} exception in case the passed class value is not a descendent of `AbstractValue`.
     *
     * @returns Returns the instantiated option class instance.
     */
    option<T = string>(
      optionclass: AbstractValue<T>,
      ...classargs: any[]
    ): AbstractValue<T>;

    /**
     * Parse this sections form input.
     *
     * The `parse()` function recursively walks the section element tree and triggers input value reading and validation for each encountered child option element.
     *
     * Options which are hidden due to unsatisified dependencies are skipped.
     *
     * @returns Returns a promise resolving once the values of all child elements have been parsed. The returned promise is rejected if any parsed values are not meeting the validation constraints of their respective elements.
     */
    parse(): Promise<void>;

    render(): Node | Promise<Node>;

    /**
     * Add an option tab to the section.
     *
     * The child option elements of a section may be divided into multiple tabs to provide a better overview to the user.
     *
     * Before options can be moved into a tab pane, the corresponding tab has to be defined first, which is done by calling this function.
     *
     * Note that once tabs are defined, user code must use the `taboption()` method to add options to specific tabs. Option elements added by `option()` will not be assigned to any tab and not be rendered in this case.
     *
     * @param name - The name of the tab to register. It may be freely chosen and just serves as an identifier to differentiate tabs.
     * @param title - The human readable caption of the tab.
     * @param description - An additional description text for the corresponding tab pane. It is displayed as text paragraph below the tab but before the tab pane contents. If omitted, no description will be rendered.
     *
     * @throws Throws an exeption if a tab with the same `name` already exists.
     */
    tab(name: string, title: string, description?: string): void;

    /**
     * Add a configuration option widget to a tab of the section.
     *
     * @param tabname - The name of the section tab to add the option element to.
     * @param optionclass - The option class to use for rendering the configuration option. Note that this value must be the class itself, not a class instance obtained from calling `new`. It must also be a class dervied from `LuCI.form.AbstractSection`.
     * @param classargs - repeatable. Additional arguments which are passed as-is to the contructor of the given option class. Refer to the class specific constructor documentation for details.
     *
     * @throws Throws a {@link ReferenceError} exception when the given tab name does not exist.
     * @throws Throws a {@link TypeError} exception in case the passed class value is not a descendent of `AbstractValue`.
     *
     * @returns Returns the instantiated option class instance.
     */
    taboption<T = string>(
      tabname: string,
      optionclass: AbstractValue<T>,
      ...classargs: any[]
    ): AbstractValue<T>;
  }

  /**
   * The `AbstractValue` class serves as abstract base for the different form option styles implemented by `LuCI.form`. It provides the common logic for handling option input values, for dependencies among options and for validation constraints that should be applied to entered values.
   *
   * This class is private and not directly accessible by user code.
   */
  class AbstractValue<T = string> extends AbstractElement {
    /**
     * Specifies a datatype constraint expression to validate input values against. Refer to `LuCI.validation` for details on the format.
     *
     * If the user entered input does not match the datatype validation, the option element is marked as invalid.
     *
     * @defaultValue null
     */
    datatype: LuCI.validation.DataTypes | null;

    /**
     * Sets a default value to use when the underlying UCI option is not set.
     *
     * @defaultValue null
     */
    default: T | null;

    /**
     * Mark grid section option element as editable.
     *
     * Options which are displayed in the table portion of a `GridSection` instance are rendered as readonly text by default. By setting the `editable` property of a child option element to `true`, that element is rendered as full input widget within its cell instead of a text only preview.
     *
     * This property has no effect on options that are not children of grid section elements.
     *
     * @defaultValue false
     */
    editable: boolean;

    /**
     * Move grid section option element into the table, the modal popup or both.
     *
     * If this property is `null` (the default), the option element is displayed in both the table preview area and the per-section instance modal popup of a grid section. When it is set to `false` the option is only shown in the table but not the modal popup. When set to `true`, the option is only visible in the modal popup but not the table.
     *
     * This property has no effect on options that are not children of grid section elements.
     *
     * @defaultValue null
     */
    modalonly: boolean | null;

    /**
     * If set to `true`, the underlying ui input widget is allowed to be empty, otherwise the option element is marked invalid when no value is entered or selected by the user.
     *
     * @defaultValue false
     */
    optional: boolean;

    /**
     * Make option element readonly.
     *
     * This property defaults to the readonly state of the parent form element. When set to `true`, the underlying widget is rendered in disabled state, means its contents cannot be changed and the widget cannot be interacted with.
     *
     * @defaultValue false
     */
    readonly: boolean;

    /**
     * If set to `false`, the underlying option value is retained upon saving the form when the option element is disabled due to unsatisfied dependency constraints.
     *
     * @defaultValue true
     */
    rmempty: boolean;

    /**
     * Override the UCI configuration name to read the option value from.
     *
     * By default, the configuration name is inherited from the parent Map. By setting this property, a deviating configuration may be specified.
     *
     * The default is null, means inheriting from the parent form.
     *
     * @defaultValue null
     */
    uciconfig: string | null;

    /**
     * Override the UCI option name to read the value from.
     *
     * By default, the elements name, which is passed as third argument to the constructor, is used as UCI option name. By setting this property, a deviating UCI option may be specified.
     *
     * The default is null, means using the option element name.
     *
     * @defaultValue null
     */
    ucioption: string | null;

    /**
     * Override the UCI section name to read the option value from.
     *
     * By default, the section ID is inherited from the parent section element. By setting this property, a deviating section may be specified.
     *
     * The default is null, means inheriting from the parent section.
     *
     * @defaultValue null
     */
    ucisection: string | null;

    /**
     * Override the cell width of a table or grid section child option.
     *
     * If the property is set to a numeric value, it is treated as pixel width which is set on the containing cell element of the option, essentially forcing a certain column width. When the property is set to a string value, it is applied as-is to the CSS `width` property.
     *
     * This property has no effect on options that are not children of grid or table section elements.
     *
     * @defaultValue null
     */
    width: number | string | null;

    /**
     * Obtain the internal ID ("cbid") of the element instance.
     *
     * Since each form section element may map multiple underlying configuration sections, the configuration section ID is required to form a fully qualified ID pointing to the specific element instance within the given specific section.
     *
     * @param section_id - The configuration section ID
     *
     * @throws Throws a {@link TypeError} exception when no `section_id` was specified.
     *
     * @returns Returns the element ID.
     */
    cbid(section_id: string): string;

    /**
     * Query the underlying configuration value.
     *
     * The default implementation of this method returns the cached return value of `load()`. It may be overwritten by user code to obtain the configuration value in a different way.
     *
     * @param section_id - The configuration section ID
     *
     * @throws Throws a {@link TypeError} exception when no `section_id` was specified.
     *
     * @returns Returns the configuration value.
     */
    cfgvalue(section_id: string): any;

    /**
     * Add a dependency contraint to the option.
     *
     * Dependency constraints allow making the presence of option elements dependant on the current values of certain other options within the same form. An option element with unsatisfied dependencies will be hidden from the view and its current value is omitted when saving.
     *
     * Multiple constraints (that is, multiple calls to `depends()`) are treated as alternatives, forming a logical "or" expression.
     *
     * By passing an object of name =\> value pairs as first argument, it is possible to depend on multiple options simultaneously, allowing to form a logical "and" expression.
     *
     * Option names may be given in "dot notation" which allows to reference option elements outside of the current form section. If a name without dot is specified, it refers to an option within the same configuration section. If specified as `configname.sectionid.optionname`, options anywhere within the same form may be specified.
     *
     * The object notation also allows for a number of special keys which are not treated as option names but as modifiers to influence the dependency constraint evaluation. The associated value of these special "tag" keys is ignored. The recognized tags are:
     *
     * - `!reverse`
     *
     * Invert the dependency, instead of requiring another option to be equal to the dependency value, that option should not be equal.
     *
     * - `!contains`
     *
     * Instead of requiring an exact match, the dependency is considered satisfied when the dependency value is contained within the option value.
     *
     * - `!default`
     *
     * The dependency is always satisfied
     *
     * Examples:
     *
     * - `opt.depends("foo", "test")`
     *
     * Require the value of `foo` to be `test`.
     *
     * - `opt.depends({ foo: "test" })`
     *
     * Equivalent to the previous example.
     *
     * - `opt.depends({ foo: "test", bar: "qrx" })`
     *
     * Require the value of `foo` to be `test` and the value of `bar` to be `qrx`.
     *
     * - `opt.depends({ foo: "test" })`
     *
     * `opt.depends({ bar: "qrx" })`
     *
     * Require either `foo` to be set to `test`, or the `bar` option to be `qrx`.
     *
     * - `opt.depends("test.section1.foo", "bar")`
     *
     * Require the "foo" form option within the "section1" section to be set to "bar".
     *
     * - `opt.depends({ foo: "test", "!contains": true })`
     *
     * Require the "foo" option value to contain the substring "test".
     *
     * @param optionname_or_depends - The name of the option to depend on or an object describing multiple dependencies which must be satified (a logical "and" expression).
     * @param optionvalue - When invoked with a plain option name as first argument, this parameter specifies the expected value. In case an object is passed as first argument, this parameter is ignored.
     */
    depends(
      optionname_or_depends: string | { [key: string]: string | boolean },
      optionvalue: string
    ): void;

    /**
     * Query the current form input value.
     *
     * The default implementation of this method returns the current input value of the underlying `LuCI.ui` widget. It may be overwritten by user code to handle input values differently.
     *
     * @param section_id - The configuration section ID
     *
     * @throws Throws a {@link TypeError} exception when no `section_id` was specified.
     *
     * @returns Returns the current input value.
     */
    formvalue(section_id: string): T;

    /**
     * Obtain the underlying `LuCI.ui` element instance.
     *
     * @param section_id - The configuration section ID
     *
     * @throws Throws a {@link TypeError} exception when no `section_id` was specified.
     *
     * @returns Returns the `LuCI.ui` element instance or `null` in case the form option implementation does not use `LuCI.ui` widgets.
     */
    getUIElement(section_id: string): LuCI.ui.AbstractElement | null;

    /**
     * Test whether the option element is currently active.
     *
     * An element is active when it is not hidden due to unsatisfied dependency constraints.
     *
     * @param section_id - The configuration section ID
     *
     * @returns Returns `true` if the option element currently is active, otherwise it returns `false`.
     */
    isActive(section_id: string): boolean;

    /**
     * Test whether the input value is currently valid.
     *
     * @param section_id - The configuration section ID
     *
     * @returns 	Returns `true` if the input value currently is valid, otherwise it returns `false`.
     */
    isValid(section_id: string): boolean;

    /**
     * Load the underlying configuration value.
     *
     * The default implementation of this method reads and returns the underlying UCI option value (or the related JavaScript property for `JSONMap` instances). It may be overwritten by user code to load data from nonstandard sources.
     *
     * @param section_id - The configuration section ID
     *
     * @throws Throws a {@link TypeError} exception when no `section_id` was specified.
     *
     * @returns Returns the configuration value to initialize the option element with. The return value of this function is filtered through `Promise.resolve()` so it may return promises if overridden by user code.
     */
    load(section_id: string): any | Promise<any>;

    /**
     * Parse the option element input.
     *
     * The function is invoked when the `parse()` method has been invoked on the parent form and triggers input value reading and validation.
     *
     * @param section_id - The configuration section ID
     *
     * @returns Returns a promise resolving once the input value has been read and validated or rejecting in case the input value does not meet the validation constraints.
     */
    parse(section_id?: string): Promise<void>;

    /**
     * Remove the corresponding value from the configuration.
     *
     * This function is invoked upon saving the parent form when the option element has been hidden due to unsatisfied dependencies or when the user cleared the input value and the option is marked optional.
     *
     * The default implementation simply removes the associated option from the UCI configuration (or the associated JavaScript object property in case of `JSONMap` forms). It may be overwritten by user code to implement alternative removal logic, e.g. to retain the original value.
     *
     * @param section_id - The configuration section ID
     */
    remove(section_id: string): void;

    render(): Node | Promise<Node>;

    /**
     * Obtain a textual input representation.
     *
     * The default implementation of this method returns the HTML escaped current input value of the underlying `LuCI.ui` widget. User code or specific option element implementations may overwrite this function to apply a different logic, e.g. to return `Yes` or `No` depending on the checked state of checkbox elements.
     *
     * @param section_id - The configuration section ID
     *
     * @throws Throws a {@link TypeError} exception when no `section_id` was specified.
     *
     * @returns Returns the text representation of the current input value.
     */
    textvalue(section_id: string): string;

    /**
     * Apply custom validation logic.
     *
     * This method is invoked whenever incremental validation is performed on the user input, e.g. on keyup or blur events.
     *
     * The default implementation of this method does nothing and always returns `true`. User code may overwrite this method to provide additional validation logic which is not covered by data type constraints.
     *
     * @param section_id - The configuration section ID
     * @param value - The value to validate
     *
     * @returns The method shall return `true` to accept the given value. Any other return value is treated as failure, converted to a string and displayed as error message to the user.
     */
    validate(section_id: string, value: T): boolean | string | object;

    /**
     * Write the current input value into the configuration.
     *
     * This function is invoked upon saving the parent form when the option element is valid and when its input value has been changed compared to the initial value returned by `cfgvalue()`.
     *
     * The default implementation simply sets the given input value in the UCI configuration (or the associated JavaScript object property in case of `JSONMap` forms). It may be overwritten by user code to implement alternative save logic, e.g. to transform the input value before it is written.
     *
     * @param section_id - The configuration section ID
     * @param formvalue - The input value to write.
     */
    write(section_id: string, formvalue: string | string[]): void;
  }

  /**
   * The `DummyValue` element wraps an `LuCI.ui.Hiddenfield` widget and renders the underlying UCI option or default value as readonly text.
   */
  class ButtonValue<S extends AbstractSection = AbstractSection> extends Value<
    boolean | string,
    S
  > {
    /**
     * Override the button style class.
     *
     * By setting this property, a specific `cbi-button-*` CSS class can be selected to influence the style of the resulting button.
     *
     * Suitable values which are implemented by most themes are `positive`, `negative` and `primary`.
     *
     * The default is `null`, means a neutral button styling is used.
     *
     * @defaultValue null
     */
    inputstyle: string | null;

    /**
     * Override the rendered button caption.
     *
     * By default, the option title - which is passed as fourth argument to the constructor - is used as caption for the button element. When setting this property to a string, it is used as `String.format()` pattern with the underlying UCI section name passed as first format argument. When set to a function, it is invoked passing the section ID as sole argument and the resulting return value is converted to a string before being used as button caption.
     *
     * The default is `null`, means the option title is used as caption.
     *
     * @defaultValue null
     */
    inputtitle: string | Function | null;

    /**
     * Override the button click action.
     *
     * By default, the underlying UCI option (or default property) value is copied into a hidden field tied to the button element and the save action is triggered on the parent form element.
     *
     * When this property is set to a function, it is invoked instead of performing the default actions. The handler function will receive the DOM click element as first and the underlying configuration section ID as second argument.
     *
     * @defaultValue null
     */
    onclick: Function | null;
  }

  /**
   * The `DummyValue` element wraps an `LuCI.ui.Hiddenfield` widget and renders the underlying UCI option or default value as readonly text.
   */
  class DummyValue<S extends AbstractSection = AbstractSection> extends Value<
    string,
    S
  > {
    /**
     * Set an URL which is opened when clicking on the dummy value text.
     *
     * By setting this property, the dummy value text is wrapped in an `<a>` element with the property value used as `href` attribute.
     *
     * @defaultValue null
     */
    href: string | null;

    /**
     * Treat the UCI option value (or the `default` property value) as HTML.
     *
     * By default, the value text is HTML escaped before being rendered as text. In some cases it may be needed to actually interpret and render HTML contents as-is. When set to `true`, HTML escaping is disabled.
     *
     * @defaultValue null
     */
    rawhtml: boolean | null;
  }

  /**
   * The `DynamicList` class represents a multi value widget allowing the user to enter multiple unique values, optionally selected from a set of predefined choices. It builds upon the `LuCI.ui.DynamicList` widget.
   */
  class DynamicList<S extends AbstractSection = AbstractSection> extends Value<
    string | string[],
    S
  > {}

  /**
   * The `FileUpload` element wraps an `LuCI.ui.FileUpload` widget and offers the ability to browse, upload and select remote files.
   */
  class FileUpload<S extends AbstractSection = AbstractSection> extends Value<
    string | string[],
    S
  > {
    /**
     * Toggle remote file delete functionality.
     *
     * When set to `true`, the underlying widget provides a buttons which let the user delete files from remote directories. Note that this is merely a cosmetic feature, remote delete permissions are controlled by the session ACL rules.
     *
     * The default is `true`, means file removal buttons are displayed.
     *
     * @defaultValue true
     */
    enable_remove: boolean;

    /**
     * Toggle file upload functionality.
     *
     * When set to `true`, the underlying widget provides a button which lets the user select and upload local files to the remote system. Note that this is merely a cosmetic feature, remote upload access is controlled by the session ACL rules.
     *
     * The default is `true`, means file upload functionality is displayed.
     *
     * @defaultValue true
     */
    enable_upload: boolean;

    /**
     * Specify the root directory for file browsing.
     *
     * This property defines the topmost directory the file browser widget may navigate to, the UI will not allow browsing directories outside this prefix. Note that this is merely a cosmetic feature, remote file access and directory listing permissions are controlled by the session ACL rules.
     *
     * @defaultValue `/etc/luci-uploads`
     */
    root_directory: string;

    /**
     * Toggle display of hidden files.
     *
     * Display hidden files when rendering the remote directory listing. Note that this is merely a cosmetic feature, hidden files are always included in received remote file listings.
     *
     * The default is `false`, means hidden files are not displayed.
     *
     * @defaultValue false
     */
    show_hidden: boolean;
  }

  class Flag<S extends AbstractSection = AbstractSection> extends Value<
    number,
    S
  > {
    /**
     * Sets the input value to use for the checkbox unchecked state.
     *
     * @defaultValue 0
     */
    disabled: number;

    /**
     * Sets the input value to use for the checkbox checked state.
     *
     * @defaultValue 1
     */
    enabled: number;
  }

  class GridSection extends TableSection {
    tab(name: string, title: string, description?: string): void;
  }

  class HiddenValue<S extends AbstractSection = AbstractSection> extends Value<
    string,
    S
  > {}

  class JSONMap extends Map {
    constructor(
      data: { [key: string]: any },
      title?: string,
      description?: string
    );
  }

  class ListValue<S extends AbstractSection = AbstractSection> extends Value<
    string[] | string,
    S
  > {
    size: number;
  }

  class Map extends AbstractElement {
    readonly: boolean;

    constructor(config: string, title?: string, description?: string);

    chain(config: string): void;

    findElement(selector_or_attrname: string, attrvalue: string): Node | null;

    findElements(selector_or_attrname: string, attrvalue: string): NodeList;

    load(): Promise<void>;

    lookupOption<T extends baseclass.Newable<AbstractValue>>(
      name_or_id: string,
      section_id?: string,
      config?: string
    ): [T, string] | null;

    parse(): Promise<void>;

    render(): Promise<Node>;

    reset(): Promise<Node>;

    save(cb: Function, silent: boolean): Promise<void>;

    section<S extends AbstractSection>(
      sectionclass: baseclass.Newable<S>,
      ...classargs: string[]
    ): S;
  }

  class MultiValue<
    S extends AbstractSection = AbstractSection
  > extends DynamicList<S> {
    display_size: number;

    dropdown_size: number;
  }

  class NamedSection extends AbstractSection {
    addremove: boolean;

    uciconfig: string;

    constructor(
      form: Map | JSONMap,
      section_id: string,
      section_type: string,
      title?: string,
      description?: string
    );

    cfgsections(): string[];

    render(): Node | Promise<Node>;
  }

  class SectionValue<
    S extends AbstractSection = AbstractSection,
    E extends AbstractSection = AbstractSection
  > extends Value<string, S> {
    constructor(
      form: Map | JSONMap,
      section: baseclass.Newable<S>,
      option: string,
      subsection_class: baseclass.Newable<E>,
      ...class_args: any[]
    );

    readonly subsection: E;
  }

  class TableSection extends TypedSection {
    extedit: string | Function;

    max_cols: number;

    modaltitle: string;

    rowcolors: boolean;

    sectiontitle: string | Function;

    sortable: boolean;

    addModalOptions(
      modalSection: NamedSection,
      section_id: string,
      ev: Event
    ): any | Promise<any>;
  }

  class TextValue<S extends AbstractSection = AbstractSection> extends Value<
    string,
    S
  > {
    cols: number;

    monospace: boolean;

    rows: number;

    wrap: number;
  }

  class TypedSection extends AbstractSection {
    addbtntitle: string | Function;

    addremove: boolean;

    anonymous: boolean;

    tabbed: boolean;

    uciconfig: string;

    constructor(
      form: Map | JSONMap,
      section_type: string,
      title?: string,
      description?: string
    );

    render(): Node | Promise<Node>;

    cfgsections(): string[];
  }

  class Value<
    T = string,
    S extends AbstractSection = AbstractSection
  > extends AbstractValue<T> {
    password: boolean;

    placeholder: string;

    constructor(
      form: Map | JSONMap,
      section: baseclass.Newable<S>,
      option: string,
      title?: string,
      description?: string
    );

    validate: (section_id: string, value: T) => any;

    render(): Node | Promise<Node>;

    value(key: string, value: Node | string): void;
  }
}
