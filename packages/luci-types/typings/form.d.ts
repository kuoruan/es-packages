// Type definitions for LuCI.form
// Documentation: http://openwrt.github.io/luci/jsapi/LuCI.form.html
// Definitions by: Xingwang Liao <https://github.com/kuoruan>
// TypeScript Version: 3.8

import baseclass from "./baseclass";

export as namespace form;
export = form;

/**
 * The LuCI form class provides high level abstractions for creating creating
 * UCI- or JSON backed configurations forms.
 *
 * To import the class in views, use `'require form'`, to import it in
 * external JavaScript, use `L.require("form").then(...)`.
 *
 * A typical form is created by first constructing a `LuCI.form.Map` or
 * `LuCI.form.JSONMap` instance using `new` and by subsequently adding
 * sections and options to it. Finally `render()` is invoked on the instance
 * to assemble the HTML markup and insert it into the DOM.
 *
 * Example:
 * ```js
 * 'use strict';
 * 'require form';
 *
 * var m, s, o;
 *
 * m = new form.Map('example', 'Example form',
 *  'This is an example form mapping the contents of /etc/config/example');
 *
 * s = m.section(form.NamedSection, 'first_section', 'example', 'The first section',
 *  'This sections maps "config example first_section" of /etc/config/example');
 *
 * o = s.option(form.Flag, 'some_bool', 'A checkbox option');
 *
 * o = s.option(form.ListValue, 'some_choice', 'A select element');
 * o.value('choice1', 'The first choice');
 * o.value('choice2', 'The second choice');
 *
 * m.render().then(function(node) {
 *  document.body.appendChild(node);
 * });
 * ```
 */
declare class form extends baseclass {}

declare namespace form {
  /**
   * The `AbstractElement` class serves as abstract base for the different form
   * elements implemented by `LuCI.form`. It provides the common logic for
   * loading and rendering values, for nesting elements and for defining common
   * properties.
   *
   * This class is private and not directly accessible by user code.
   */
  abstract class AbstractElement extends baseclass {
    /**
     * Add another form element as children to this element.
     *
     * @param element - The form element to add.
     */
    append<E extends AbstractElement>(element: baseclass.Newable<E>): void;

    /**
     * Parse this elements form input.
     *
     * `The parse()` function recursively walks the form element tree and
     * triggers input value reading and validation for each encountered element.
     *
     * Elements which are hidden due to unsatisified dependencies are skipped.
     *
     * @returns Returns a promise resolving once this element's value and the
     * values of all child elements have been parsed. The returned promise is
     * rejected if any parsed values are not meeting the validation constraints
     * of their respective elements.
     */
    parse(): Promise<void>;

    /**
     * Render the form element.
     *
     * The `render()` function recursively walks the form element tree and
     * renders the markup for each element, returning the assembled DOM tree.
     *
     * @returns May return a DOM Node or a promise resolving to a DOM node
     * containing the form element's markup, including the markup of any child
     * elements.
     */
    abstract render(...args: any[]): Node | Promise<Node>;

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
     * This function looks up the given named property and formats its value
     * suitable for use as element caption or description string. It also strips
     * any HTML tags from the result.
     *
     * If the property value is a string, it is passed to `String.format()`
     * along with any additional parameters passed to `titleFn()`.
     *
     * If the property value is a function, it is invoked with any additional
     * `titleFn()` parameters as arguments and the obtained return value is
     * converted to a string.
     *
     * In all other cases, `null` is returned.
     *
     * @param property - The name of the element property to use.
     * @param fmt_args - repeatable. Extra values to format the title string
     * with.
     *
     * @returns The formatted title string or `null` if the property did not
     * exist or was neither a string nor a function.
     */
    titleFn(property: string, ...fmt_args: any[]): string | null;
  }

  /**
   * The `AbstractSection` class serves as abstract base for the different form
   * section styles implemented by `LuCI.form`. It provides the common logic for
   * enumerating underlying configuration section instances, for registering
   * form options and for handling tabs to segment child options.
   *
   * This class is private and not directly accessible by user code.
   */
  class AbstractSection extends AbstractElement {
    /**
     * Access the parent option container instance.
     *
     * In case this section is nested within an option element container, this
     * property will hold a reference to the parent option instance.
     *
     * If this section is not nested, the property is `null`.
     */
    readonly parentoption: baseclass.Newable<AbstractValue>;

    /**
     * Enumerate the UCI section IDs covered by this form section element.
     *
     * @throws Throws an {@link InternalError} exception if the function is not
     * implemented.
     *
     * @returns Returns an array of UCI section IDs covered by this form
     * element. The sections will be rendered in the same order as the returned
     * array.
     */
    cfgsections(): string[];

    /**
     * Filter UCI section IDs to render.
     *
     * The filter function is invoked for each UCI section ID of a given type
     * and controls whether the given UCI section is rendered or ignored by the
     * form section element.
     *
     * The default implementation always returns `true`. User code or classes
     * extending `AbstractSection` may overwrite this function with custom
     * implementations.
     *
     * @param section_id - The UCI section ID to test.
     *
     * @returns Returns `true` when the given UCI section ID should be handled
     * and `false` when it should be ignored.
     */
    filter(section_id: string): boolean;

    /**
     * Load the configuration covered by this section.
     *
     * The `load()` function recursively walks the section element tree and
     * invokes the load function of each child option element.
     *
     * @returns Returns a promise resolving once the values of all child
     * elements have been loaded. The promise may reject with an error if any of
     * the child elements load functions rejected with an error.
     */
    load(): Promise<void>;

    /**
     * Add a configuration option widget to the section.
     *
     * Note that taboption() should be used instead if this form section element
     * uses tabs.
     *
     * @param optionclass - The option class to use for rendering the
     * configuration option. Note that this value must be the class itself, not
     * a class instance obtained from calling `new`. It must also be a class
     * dervied from `LuCI.form.AbstractSection`.
     * @param classargs - repeatable. Additional arguments which are passed
     * as-is to the contructor of the given option class. Refer to the class
     * specific constructor documentation for details.
     *
     * @throws Throws a {@link TypeError} exception in case the passed class
     * value is not a descendent of `AbstractValue`.
     *
     * @returns Returns the instantiated option class instance.
     */
    option<O extends AbstractValue>(
      optionclass: baseclass.Newable<O>,
      ...classargs: any[]
    ): O;

    /**
     * Parse this sections form input.
     *
     * The `parse()` function recursively walks the section element tree and
     * triggers input value reading and validation for each encountered child
     * option element.
     *
     * Options which are hidden due to unsatisified dependencies are skipped.
     *
     * @returns Returns a promise resolving once the values of all child
     * elements have been parsed. The returned promise is rejected if any parsed
     * values are not meeting the validation constraints of their respective
     * elements.
     */
    parse(): Promise<void>;

    render(): Node | Promise<Node>;

    /**
     * Add an option tab to the section.
     *
     * The child option elements of a section may be divided into multiple tabs
     * to provide a better overview to the user.
     *
     * Before options can be moved into a tab pane, the corresponding tab has to
     * be defined first, which is done by calling this function.
     *
     * Note that once tabs are defined, user code must use the `taboption()`
     * method to add options to specific tabs. Option elements added by
     * `option()` will not be assigned to any tab and not be rendered in this
     * case.
     *
     * @param name - The name of the tab to register. It may be freely chosen
     * and just serves as an identifier to differentiate tabs.
     * @param title - The human readable caption of the tab.
     * @param description - An additional description text for the corresponding
     * tab pane. It is displayed as text paragraph below the tab but before the
     * tab pane contents. If omitted, no description will be rendered.
     *
     * @throws Throws an exeption if a tab with the same `name` already exists.
     */
    tab(name: string, title: string, description?: string): void;

    /**
     * Add a configuration option widget to a tab of the section.
     *
     * @param tabname - The name of the section tab to add the option element
     * to.
     * @param optionclass - The option class to use for rendering the
     * configuration option. Note that this value must be the class itself, not
     * a class instance obtained from calling `new`. It must also be a class
     * dervied from `LuCI.form.AbstractSection`.
     * @param classargs - repeatable. Additional arguments which are passed
     * as-is to the contructor of the given option class. Refer to the class
     * specific constructor documentation for details.
     *
     * @throws Throws a {@link ReferenceError} exception when the given tab name
     * does not exist.
     * @throws Throws a {@link TypeError} exception in case the passed class
     * value is not a descendent of `AbstractValue`.
     *
     * @returns Returns the instantiated option class instance.
     */
    taboption<O extends AbstractValue>(
      tabname: string,
      optionclass: baseclass.Newable<O>,
      ...classargs: any[]
    ): O;
  }

  /**
   * The `AbstractValue` class serves as abstract base for the different form
   * option styles implemented by `LuCI.form`. It provides the common logic for
   * handling option input values, for dependencies among options and for
   * validation constraints that should be applied to entered values.
   *
   * This class is private and not directly accessible by user code.
   */
  class AbstractValue<T = string> extends AbstractElement {
    /**
     * Specifies a datatype constraint expression to validate input values
     * against. Refer to `LuCI.validation` for details on the format.
     *
     * If the user entered input does not match the datatype validation, the
     * option element is marked as invalid.
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
     * Options which are displayed in the table portion of a `GridSection`
     * instance are rendered as readonly text by default. By setting the
     * `editable` property of a child option element to `true`, that element is
     * rendered as full input widget within its cell instead of a text only
     * preview.
     *
     * This property has no effect on options that are not children of grid
     * section elements.
     *
     * @defaultValue false
     */
    editable: boolean;

    /**
     * Move grid section option element into the table, the modal popup or both.
     *
     * If this property is `null` (the default), the option element is displayed
     * in both the table preview area and the per-section instance modal popup
     * of a grid section. When it is set to `false` the option is only shown in
     * the table but not the modal popup. When set to `true`, the option is only
     * visible in the modal popup but not the table.
     *
     * This property has no effect on options that are not children of grid
     * section elements.
     *
     * @defaultValue null
     */
    modalonly: boolean | null;

    /**
     * If set to `true`, the underlying ui input widget is allowed to be empty,
     * otherwise the option element is marked invalid when no value is entered
     * or selected by the user.
     *
     * @defaultValue false
     */
    optional: boolean;

    /**
     * Make option element readonly.
     *
     * This property defaults to the readonly state of the parent form element.
     * When set to `true`, the underlying widget is rendered in disabled state,
     * means its contents cannot be changed and the widget cannot be interacted
     * with.
     *
     * @defaultValue false
     */
    readonly: boolean;

    /**
     * If set to `false`, the underlying option value is retained upon saving
     * the form when the option element is disabled due to unsatisfied
     * dependency constraints.
     *
     * @defaultValue true
     */
    rmempty: boolean;

    /**
     * Override the UCI configuration name to read the option value from.
     *
     * By default, the configuration name is inherited from the parent Map. By
     * setting this property, a deviating configuration may be specified.
     *
     * The default is null, means inheriting from the parent form.
     *
     * @defaultValue null
     */
    uciconfig: string | null;

    /**
     * Override the UCI option name to read the value from.
     *
     * By default, the elements name, which is passed as third argument to the
     * constructor, is used as UCI option name. By setting this property, a
     * deviating UCI option may be specified.
     *
     * The default is null, means using the option element name.
     *
     * @defaultValue null
     */
    ucioption: string | null;

    /**
     * Override the UCI section name to read the option value from.
     *
     * By default, the section ID is inherited from the parent section element.
     * By setting this property, a deviating section may be specified.
     *
     * The default is null, means inheriting from the parent section.
     *
     * @defaultValue null
     */
    ucisection: string | null;

    /**
     * Override the cell width of a table or grid section child option.
     *
     * If the property is set to a numeric value, it is treated as pixel width
     * which is set on the containing cell element of the option, essentially
     * forcing a certain column width. When the property is set to a string
     * value, it is applied as-is to the CSS `width` property.
     *
     * This property has no effect on options that are not children of grid or
     * table section elements.
     *
     * @defaultValue null
     */
    width: number | string | null;

    /**
     * Obtain the internal ID ("cbid") of the element instance.
     *
     * Since each form section element may map multiple underlying configuration
     * sections, the configuration section ID is required to form a fully
     * qualified ID pointing to the specific element instance within the given
     * specific section.
     *
     * @param section_id - The configuration section ID
     *
     * @throws Throws a {@link TypeError} exception when no `section_id` was
     * specified.
     *
     * @returns Returns the element ID.
     */
    cbid(section_id: string): string;

    /**
     * Query the underlying configuration value.
     *
     * The default implementation of this method returns the cached return value
     * of `load()`. It may be overwritten by user code to obtain the
     * configuration value in a different way.
     *
     * @param section_id - The configuration section ID
     *
     * @throws Throws a {@link TypeError} exception when no `section_id` was
     * specified.
     *
     * @returns Returns the configuration value.
     */
    cfgvalue(section_id: string, set_value: any): T | Promise<T> | null;

    /**
     * Add a dependency contraint to the option.
     *
     * Dependency constraints allow making the presence of option elements
     * dependant on the current values of certain other options within the same
     * form. An option element with unsatisfied dependencies will be hidden from
     * the view and its current value is omitted when saving.
     *
     * Multiple constraints (that is, multiple calls to `depends()`) are treated
     * as alternatives, forming a logical "or" expression.
     *
     * By passing an object of name =\> value pairs as first argument, it is
     * possible to depend on multiple options simultaneously, allowing to form a
     * logical "and" expression.
     *
     * Option names may be given in "dot notation" which allows to reference
     * option elements outside of the current form section. If a name without
     * dot is specified, it refers to an option within the same configuration
     * section. If specified as `configname.sectionid.optionname`, options
     * anywhere within the same form may be specified.
     *
     * The object notation also allows for a number of special keys which are
     * not treated as option names but as modifiers to influence the dependency
     * constraint evaluation. The associated value of these special "tag" keys
     * is ignored. The recognized tags are:
     *
     * - `!reverse`
     *
     * Invert the dependency, instead of requiring another option to be equal to
     * the dependency value, that option should not be equal.
     *
     * - `!contains`
     *
     * Instead of requiring an exact match, the dependency is considered
     * satisfied when the dependency value is contained within the option value.
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
     * Require the value of `foo` to be `test` and the value of `bar` to be
     * `qrx`.
     *
     * - `opt.depends({ foo: "test" })`
     *
     * `opt.depends({ bar: "qrx" })`
     *
     * Require either `foo` to be set to `test`, or the `bar` option to be
     * `qrx`.
     *
     * - `opt.depends("test.section1.foo", "bar")`
     *
     * Require the "foo" form option within the "section1" section to be set to
     * "bar".
     *
     * - `opt.depends({ foo: "test", "!contains": true })`
     *
     * Require the "foo" option value to contain the substring "test".
     *
     * @param optionname_or_depends - The name of the option to depend on or an
     * object describing multiple dependencies which must be satified (a logical
     * "and" expression).
     * @param optionvalue - When invoked with a plain option name as first
     * argument, this parameter specifies the expected value. In case an object
     * is passed as first argument, this parameter is ignored.
     */
    depends(
      optionname_or_depends: string | { [key: string]: string | boolean },
      optionvalue: string
    ): void;

    /**
     * Query the current form input value.
     *
     * The default implementation of this method returns the current input value
     * of the underlying `LuCI.ui` widget. It may be overwritten by user code to
     * handle input values differently.
     *
     * @param section_id - The configuration section ID
     *
     * @throws Throws a {@link TypeError} exception when no `section_id` was
     * specified.
     *
     * @returns Returns the current input value.
     */
    formvalue(section_id: string): T;

    /**
     * Obtain the underlying `LuCI.ui` element instance.
     *
     * @param section_id - The configuration section ID
     *
     * @throws Throws a {@link TypeError} exception when no `section_id` was
     * specified.
     *
     * @returns Returns the `LuCI.ui` element instance or `null` in case the
     * form option implementation does not use `LuCI.ui` widgets.
     */
    getUIElement(section_id: string): LuCI.ui.AbstractElement | null;

    /**
     * Test whether the option element is currently active.
     *
     * An element is active when it is not hidden due to unsatisfied dependency
     * constraints.
     *
     * @param section_id - The configuration section ID
     *
     * @returns Returns `true` if the option element currently is active,
     * otherwise it returns `false`.
     */
    isActive(section_id: string): boolean;

    /**
     * Test whether the input value is currently valid.
     *
     * @param section_id - The configuration section ID
     *
     * @returns   Returns `true` if the input value currently is valid,
     * otherwise it returns `false`.
     */
    isValid(section_id: string): boolean;

    /**
     * Load the underlying configuration value.
     *
     * The default implementation of this method reads and returns the
     * underlying UCI option value (or the related JavaScript property for
     * `JSONMap` instances). It may be overwritten by user code to load data
     * from nonstandard sources.
     *
     * @param section_id - The configuration section ID
     *
     * @throws Throws a {@link TypeError} exception when no `section_id` was
     * specified.
     *
     * @returns Returns the configuration value to initialize the option element
     * with. The return value of this function is filtered through
     * `Promise.resolve()` so it may return promises if overridden by user code.
     */
    load(section_id: string): any | Promise<any>;

    /**
     * Parse the option element input.
     *
     * The function is invoked when the `parse()` method has been invoked on the
     * parent form and triggers input value reading and validation.
     *
     * @param section_id - The configuration section ID
     *
     * @returns Returns a promise resolving once the input value has been read
     * and validated or rejecting in case the input value does not meet the
     * validation constraints.
     */
    parse(section_id?: string): Promise<void>;

    /**
     * Remove the corresponding value from the configuration.
     *
     * This function is invoked upon saving the parent form when the option
     * element has been hidden due to unsatisfied dependencies or when the user
     * cleared the input value and the option is marked optional.
     *
     * The default implementation simply removes the associated option from the
     * UCI configuration (or the associated JavaScript object property in case
     * of `JSONMap` forms). It may be overwritten by user code to implement
     * alternative removal logic, e.g. to retain the original value.
     *
     * @param section_id - The configuration section ID
     */
    remove(section_id: string): void;

    render(
      option_index: number,
      section_id: string,
      in_table: boolean
    ): Node | Promise<Node>;

    /**
     * Obtain a textual input representation.
     *
     * The default implementation of this method returns the HTML escaped
     * current input value of the underlying `LuCI.ui` widget. User code or
     * specific option element implementations may overwrite this function to
     * apply a different logic, e.g. to return `Yes` or `No` depending on the
     * checked state of checkbox elements.
     *
     * @param section_id - The configuration section ID
     *
     * @throws Throws a {@link TypeError} exception when no `section_id` was
     * specified.
     *
     * @returns Returns the text representation of the current input value.
     */
    textvalue(section_id: string): string;

    /**
     * Apply custom validation logic.
     *
     * This method is invoked whenever incremental validation is performed on
     * the user input, e.g. on keyup or blur events.
     *
     * The default implementation of this method does nothing and always returns
     * `true`. User code may overwrite this method to provide additional
     * validation logic which is not covered by data type constraints.
     *
     * @param section_id - The configuration section ID
     * @param value - The value to validate
     *
     * @returns The method shall return `true` to accept the given value. Any
     * other return value is treated as failure, converted to a string and
     * displayed as error message to the user.
     */
    validate(section_id: string, value: T): boolean | string | object;

    /**
     * Write the current input value into the configuration.
     *
     * This function is invoked upon saving the parent form when the option
     * element is valid and when its input value has been changed compared to
     * the initial value returned by `cfgvalue()`.
     *
     * The default implementation simply sets the given input value in the UCI
     * configuration (or the associated JavaScript object property in case of
     * `JSONMap` forms). It may be overwritten by user code to implement
     * alternative save logic, e.g. to transform the input value before it is
     * written.
     *
     * @param section_id - The configuration section ID
     * @param formvalue - The input value to write.
     */
    write(section_id: string, formvalue: string | string[]): void;
  }

  /**
   * The `DummyValue` element wraps an `LuCI.ui.Hiddenfield` widget and renders
   * the underlying UCI option or default value as readonly text.
   */
  class ButtonValue<S extends AbstractSection = AbstractSection> extends Value<
    boolean | string,
    S
  > {
    /**
     * Override the button style class.
     *
     * By setting this property, a specific `cbi-button-*` CSS class can be
     * selected to influence the style of the resulting button.
     *
     * Suitable values which are implemented by most themes are `positive`,
     * `negative` and `primary`.
     *
     * The default is `null`, means a neutral button styling is used.
     *
     * @defaultValue null
     */
    inputstyle: string | null;

    /**
     * Override the rendered button caption.
     *
     * By default, the option title - which is passed as fourth argument to the
     * constructor - is used as caption for the button element. When setting
     * this property to a string, it is used as `String.format()` pattern with
     * the underlying UCI section name passed as first format argument. When set
     * to a function, it is invoked passing the section ID as sole argument and
     * the resulting return value is converted to a string before being used as
     * button caption.
     *
     * The default is `null`, means the option title is used as caption.
     *
     * @defaultValue null
     */
    inputtitle: string | Function | null;

    /**
     * Override the button click action.
     *
     * By default, the underlying UCI option (or default property) value is
     * copied into a hidden field tied to the button element and the save action
     * is triggered on the parent form element.
     *
     * When this property is set to a function, it is invoked instead of
     * performing the default actions. The handler function will receive the DOM
     * click element as first and the underlying configuration section ID as
     * second argument.
     *
     * @defaultValue null
     */
    onclick: Function | null;
  }

  /**
   * The `DummyValue` element wraps an `LuCI.ui.Hiddenfield` widget and renders
   * the underlying UCI option or default value as readonly text.
   */
  class DummyValue<S extends AbstractSection = AbstractSection> extends Value<
    string,
    S
  > {
    /**
     * Set an URL which is opened when clicking on the dummy value text.
     *
     * By setting this property, the dummy value text is wrapped in an `<a>`
     * element with the property value used as `href` attribute.
     *
     * @defaultValue null
     */
    href: string | null;

    /**
     * Treat the UCI option value (or the `default` property value) as HTML.
     *
     * By default, the value text is HTML escaped before being rendered as text.
     * In some cases it may be needed to actually interpret and render HTML
     * contents as-is. When set to `true`, HTML escaping is disabled.
     *
     * @defaultValue null
     */
    rawhtml: boolean | null;
  }

  /**
   * The `DynamicList` class represents a multi value widget allowing the user
   * to enter multiple unique values, optionally selected from a set of
   * predefined choices. It builds upon the `LuCI.ui.DynamicList` widget.
   */
  class DynamicList<S extends AbstractSection = AbstractSection> extends Value<
    string | string[],
    S
  > {}

  /**
   * The `FileUpload` element wraps an `LuCI.ui.FileUpload` widget and offers
   * the ability to browse, upload and select remote files.
   */
  class FileUpload<S extends AbstractSection = AbstractSection> extends Value<
    string | string[],
    S
  > {
    /**
     * Toggle remote file delete functionality.
     *
     * When set to `true`, the underlying widget provides a buttons which let
     * the user delete files from remote directories. Note that this is merely a
     * cosmetic feature, remote delete permissions are controlled by the session
     * ACL rules.
     *
     * The default is `true`, means file removal buttons are displayed.
     *
     * @defaultValue true
     */
    enable_remove: boolean;

    /**
     * Toggle file upload functionality.
     *
     * When set to `true`, the underlying widget provides a button which lets
     * the user select and upload local files to the remote system. Note that
     * this is merely a cosmetic feature, remote upload access is controlled by
     * the session ACL rules.
     *
     * The default is `true`, means file upload functionality is displayed.
     *
     * @defaultValue true
     */
    enable_upload: boolean;

    /**
     * Specify the root directory for file browsing.
     *
     * This property defines the topmost directory the file browser widget may
     * navigate to, the UI will not allow browsing directories outside this
     * prefix. Note that this is merely a cosmetic feature, remote file access
     * and directory listing permissions are controlled by the session ACL
     * rules.
     *
     * @defaultValue `/etc/luci-uploads`
     */
    root_directory: string;

    /**
     * Toggle display of hidden files.
     *
     * Display hidden files when rendering the remote directory listing. Note
     * that this is merely a cosmetic feature, hidden files are always included
     * in received remote file listings.
     *
     * The default is `false`, means hidden files are not displayed.
     *
     * @defaultValue false
     */
    show_hidden: boolean;
  }

  /**
   * The `FlagValue` element builds upon the `LuCI.ui.Checkbox` widget to
   * implement a simple checkbox element.
   */
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

  /**
   * The `GridSection` class maps all or - if `filter()` is overwritten - a
   * subset of the underlying UCI configuration sections of a given type.
   *
   * A grid section functions similar to a `LuCI.form.TableSection` but supports
   * tabbing in the modal overlay. Option elements added with `option()` are
   * shown in the table while elements added with `taboption()` are displayed in
   * the modal popup.
   *
   * Another important difference is that the table cells show a readonly text
   * preview of the corresponding option elements by default, unless the child
   * option element is explicitely made writable by setting the `editable`
   * property to `true`.
   *
   * Additionally, the grid section honours a `modalonly` property of child
   * option elements. Refer to the AbstractValue documentation for details.
   *
   * Layout wise, a grid section looks mostly identical to table sections.
   */
  class GridSection extends TableSection {
    /**
     * Add an option tab to the section.
     *
     * The modal option elements of a grid section may be divided into multiple
     * tabs to provide a better overview to the user.
     *
     * Before options can be moved into a tab pane, the corresponding tab has to
     * be defined first, which is done by calling this function.
     *
     * Note that tabs are only effective in modal popups, options added with
     * `option()` will not be assigned to a specific tab and are rendered in the
     * table view only.
     *
     * @param name - The name of the tab to register. It may be freely chosen
     * and just serves as an identifier to differentiate tabs.
     * @param title - The human readable caption of the tab.
     * @param description - An additional description text for the corresponding
     * tab pane. It is displayed as text paragraph below the tab but before the
     * tab pane contents. If omitted, no description will be rendered.
     *
     * @throws Throws an exeption if a tab with the same `name` already exists.
     */
    tab(name: string, title: string, description?: string): void;
  }

  /**
   * The `HiddenValue` element wraps an `LuCI.ui.Hiddenfield` widget.
   *
   * Hidden value widgets used to be necessary in legacy code which actually
   * submitted the underlying HTML form the server. With client side handling of
   * forms, there are more efficient ways to store hidden state data.
   *
   * Since this widget has no visible content, the title and description values
   * of this form element should be set to `null` as well to avoid a broken or
   * distorted form layout when rendering the option element.
   */
  class HiddenValue<S extends AbstractSection = AbstractSection> extends Value<
    string,
    S
  > {}

  /**
   * A `JSONMap` class functions similar to `LuCI.form.Map` but uses a
   * multidimensional JavaScript object instead of UCI configuration as data
   * source.
   */
  class JSONMap extends Map {
    /**
     * Instantiate a JSONMap element.
     *
     * @param data - The JavaScript object to use as data source. Internally,
     * the object is converted into an UCI-like format. Its toplevel keys are
     * treated like UCI section types while the object or array-of-object values
     * are treated as section contents.
     * @param title - The title caption of the form. A form title is usually
     * rendered as separate headline element before the actual form contents. If
     * omitted, the corresponding headline element will not be rendered.
     * @param description - The description text of the form which is usually
     * rendered as text paragraph below the form title and before the actual
     * form conents. If omitted, the corresponding paragraph element will not be
     * rendered.
     */
    constructor(
      data: { [key: string]: any },
      title?: string,
      description?: string
    );
  }

  /**
   * The `ListValue` class implements a simple static HTML select element
   * allowing the user to chose a single value from a set of predefined choices.
   * It builds upon the `LuCI.ui.Select` widget.
   */
  class ListValue<S extends AbstractSection = AbstractSection> extends Value<
    string[] | string,
    S
  > {
    /**
     * Set the size attribute of the underlying HTML select element.
     *
     * @defaultValue null
     */
    size: number | null;
  }

  /**
   * The `Map` class represents one complete form. A form usually maps one UCI
   * configuraton file and is divided into multiple sections containing multiple
   * fields each.
   *
   * It serves as main entry point into the `LuCI.form` for typical view code.
   */
  class Map extends AbstractElement {
    /**
     * Toggle readonly state of the form.
     *
     * If set to `true`, the Map instance is marked readonly and any form option
     * elements added to it will inherit the readonly state.
     *
     * If left unset, the Map will test the access permission of the primary uci
     * configuration upon loading and mark the form readonly if no write
     * permissions are granted.
     */
    readonly: boolean;

    /**
     * Instantiate a Map element.
     *
     * @param config - The UCI configuration to map. It is automatically loaded
     * along when the resulting map instance.
     * @param title - The title caption of the form. A form title is usually
     * rendered as separate headline element before the actual form contents. If
     * omitted, the corresponding headline element will not be rendered.
     * @param description - The description text of the form which is usually
     * rendered as text paragraph below the form title and before the actual
     * form conents. If omitted, the corresponding paragraph element will not be
     * rendered.
     */
    constructor(config: string, title?: string, description?: string);

    /**
     * Tie another UCI configuration to the map.
     *
     * By default, a map instance will only load the UCI configuration file
     * specified in the constructor but sometimes access to values from further
     * configuration files is required. This function allows for such use cases
     * by registering further UCI configuration files which are needed by the
     * map.
     *
     * @param config - The additional UCI configuration file to tie to the map.
     * If the given config already is in the list of required files, it will be
     * ignored.
     */
    chain(config: string): void;

    /**
     * Find the first DOM node within this Map which matches the given search
     * parameters. This function is essentially a convenience wrapper around
     * `findElements()` which only returns the first found node.
     *
     * This function is sensitive to the amount of arguments passed to it; if
     * only one argument is specified, it is used as selector-expression as-is.
     * When two arguments are passed, the first argument is treated as attribute
     * name, the second one as attribute value to match.
     *
     * As an example, `map.findElement('input')` would find the first `<input>`
     * node while `map.findElement('type', 'text')` would find the first DOM
     * node with a `type="text"` attribute.
     *
     * @param selector_or_attrname - If invoked with only one parameter, this
     * argument is a `querySelector()` compatible selector expression. If
     * invoked with two parameters, this argument is the attribute name to
     * filter for.
     * @param attrvalue - In case the function is invoked with two parameters,
     * this argument specifies the attribute value to match.
     *
     * @throws Throws an {@link InternalError} if more than two function
     * parameters are passed.
     *
     * @returns Returns the first found DOM node or `null` if no element
     * matched.
     */
    findElement(selector_or_attrname: string, attrvalue?: string): Node | null;

    /**
     * Find all DOM nodes within this Map which match the given search
     * parameters. This function is essentially a convenience wrapper around
     * `querySelectorAll()`.
     *
     * This function is sensitive to the amount of arguments passed to it; if
     * only one argument is specified, it is used as selector-expression as-is.
     * When two arguments are passed, the first argument is treated as attribute
     * name, the second one as attribute value to match.
     *
     * As an example, `map.findElements('input')` would find all `<input>` nodes
     * while `map.findElements('type', 'text')` would find any DOM node with a
     * `type="text"` attribute.
     *
     * @param selector_or_attrname - If invoked with only one parameter, this
     * argument is a `querySelectorAll()` compatible selector expression. If
     * invoked with two parameters, this argument is the attribute name to
     * filter for.
     * @param attrvalue - In case the function is invoked with two parameters,
     * this argument specifies the attribute value to match.
     *
     * @throws Throws an {@link InternalError} if more than two function
     * parameters are passed.
     *
     * @returns Returns a (possibly empty) DOM `NodeList` containing the found
     * DOM nodes.
     */
    findElements(selector_or_attrname: string, attrvalue?: string): NodeList;

    /**
     * Load the configuration covered by this map.
     *
     * The `load()` function first loads all referenced UCI configurations, then
     * it recursively walks the form element tree and invokes the load function
     * of each child element.
     *
     * @returns Returns a promise resolving once the entire form completed
     * loading all data. The promise may reject with an error if any
     * configuration failed to load or if any of the child elements load
     * functions rejected with an error.
     */
    load(): Promise<void>;

    /**
     * Find a form option element instance.
     *
     * @param name_or_id - The name or the full ID of the option element to look
     * up.
     * @param section_id - The ID of the UCI section containing the option to
     * look up. May be omitted if a full ID is passed as first argument.
     * @param config - The name of the UCI configuration the option instance is
     * belonging to. Defaults to the main UCI configuration of the map if
     * omitted.
     *
     * @returns Returns a two-element array containing the form option instance
     * as first item and the corresponding UCI section ID as second item.
     * Returns `null` if the option could not be found.
     */
    lookupOption<T extends AbstractValue>(
      name_or_id: string,
      section_id?: string,
      config?: string
    ): [baseclass.Newable<T>, string] | null;

    /**
     * Parse the form input values.
     *
     * The `parse()` function recursively walks the form element tree and
     * triggers input value reading and validation for each child element.
     *
     * Elements which are hidden due to unsatisified dependencies are skipped.
     *
     * @returns Returns a promise resolving once the entire form completed
     * parsing all input values. The returned promise is rejected if any parsed
     * values are not meeting the validation constraints of their respective
     * elements.
     */
    parse(): Promise<void>;

    /**
     * Render the form markup.
     *
     * @returns Returns a promise resolving to the toplevel form DOM node once
     * the rendering is complete.
     */
    render(): Promise<Node>;

    /**
     * Reset the form by re-rendering its contents. This will revert all unsaved
     * user inputs to their initial form state.
     *
     * @returns Returns a promise resolving to the toplevel form DOM node once
     * the re-rendering is complete.
     */
    reset(): Promise<Node>;

    /**
     * Save the form input values.
     *
     * This function parses the current form, saves the resulting UCI changes,
     * reloads the UCI configuration data and redraws the form elements.
     *
     * @param cb - An optional callback function that is invoked after the form
     * is parsed but before the changed UCI data is saved. This is useful to
     * perform additional data manipulation steps before saving the changes.
     * @param silent - If set to `true`, trigger an alert message to the user in
     * case saving the form data failes. Otherwise fail silently.
     *
     * @returns Returns a promise resolving once the entire save operation is
     * complete. The returned promise is rejected if any step of the save
     * operation failed.
     */
    save(cb?: Function, silent?: boolean): Promise<void>;

    /**
     * Add a configuration section to the map.
     *
     * LuCI forms follow the structure of the underlying UCI configurations,
     * means that a map, which represents a single UCI configuration, is divided
     * into multiple sections which in turn contain an arbitrary number of
     * options.
     *
     * While UCI itself only knows two kinds of sections - named and anonymous
     * ones - the form class offers various flavors of form section elements to
     * present configuration sections in different ways. Refer to the
     * documentation of the different section classes for details.
     *
     * @param sectionclass - The section class to use for rendering the
     * configuration section. Note that this value must be the class itself, not
     * a class instance obtained from calling `new`. It must also be a class
     * dervied from `LuCI.form.AbstractSection`.
     * @param classargs - repeatable. Additional arguments which are passed
     * as-is to the contructor of the given section class. Refer to the class
     * specific constructor documentation for details.
     *
     * @returns Returns the instantiated section class instance.
     */
    section<S extends AbstractSection>(
      sectionclass: baseclass.Newable<S>,
      ...classargs: string[]
    ): S;
  }

  /**
   * The `MultiValue` class is a modified variant of the `DynamicList` element
   * which leverages the `LuCI.ui.Dropdown` widget to implement a multi select
   * dropdown element.
   */
  class MultiValue<
    S extends AbstractSection = AbstractSection
  > extends DynamicList<S> {
    /**
     * Allows to specify the `display_items` property of the underlying dropdown
     * widget. If omitted, the value of the `size` property is used or `3` when
     * `size` is unspecified as well.
     *
     * @defaultValue null
     */
    display_size: number | null;

    /**
     * Allows to specify the `dropdown_items` property of the underlying
     * dropdown widget. If omitted, the value of the `size` property is used or
     * `-1` when `size` is unspecified as well.
     *
     * @defaultValue null
     */
    dropdown_size: number | null;
  }

  /**
   * The `NamedSection` class maps exactly one UCI section instance which is
   * specified when constructing the class instance.
   *
   * Layout and functionality wise, a named section is essentially a
   * `TypedSection` which allows exactly one section node.
   */
  class NamedSection extends AbstractSection {
    /**
     * If set to `true`, the user may remove or recreate the sole mapped
     * configuration instance from the form section widget, otherwise only a
     * preexisting section may be edited. The default is `false`.
     *
     * @defaultValue false
     */
    addremove: boolean;

    /**
     * Override the UCI configuration name to read the section IDs from. By
     * default, the configuration name is inherited from the parent `Map`. By
     * setting this property, a deviating configuration may be specified. The
     * default is `null`, means inheriting from the parent form.
     */
    uciconfig: string | null;

    /**
     * Instantiate a NamedSection element.
     *
     * @param form - The configuration form this section is added to. It is
     * automatically passed by `section()`.
     * @param section_id - The name (ID) of the UCI section to map.
     * @param section_type - The type of the UCI section to map.
     * @param title - The title caption of the form section element.
     * @param description - The description text of the form section element.
     */
    constructor(
      form: Map | JSONMap,
      section_id: string,
      section_type: string,
      title?: string,
      description?: string
    );

    /**
     * The `NamedSection` class overwrites the generic `cfgsections()`
     * implementation to return a one-element array containing the mapped
     * section ID as sole element. User code should not normally change this.
     *
     * @returns Returns a one-element array containing the mapped section ID.
     */
    cfgsections(): string[];
  }

  /**
   * The `SectionValue` widget embeds a form section element within an option
   * element container, allowing to nest form sections into other sections.
   */
  class SectionValue<
    S extends AbstractSection = AbstractSection,
    E extends AbstractSection = AbstractSection
  > extends Value<string, S> {
    /**
     * Access the embedded section instance.
     *
     * This property holds a reference to the instantiated nested section.
     */
    readonly subsection: E;

    /**
     * Instantiate a SectionValue element.
     *
     * @param form - The configuration form this section is added to. It is
     * automatically passed by `option()` or `taboption()` when adding the
     * option to the section.
     * @param section - The configuration section this option is added to. It is
     * automatically passed by `option()` or `taboption()` when adding the
     * option to the section.
     * @param option - The internal name of the option element holding the
     * section. Since a section container element does not read or write any
     * configuration itself, the name is only used internally and does not need
     * to relate to any underlying UCI option name.
     * @param subsection_class - The class to use for instantiating the nested
     * section element. Note that the class value itself is expected here, not a
     * class instance obtained by calling `new`. The given class argument must
     * be a subclass of the `AbstractSection` class.
     * @param class_args - repeatable. All further arguments are passed as-is to
     * the subclass constructor. Refer to the corresponding class constructor
     * documentations for details.
     */
    constructor(
      form: Map | JSONMap,
      section: baseclass.Newable<S>,
      option: string,
      subsection_class: baseclass.Newable<E>,
      ...class_args: any[]
    );
  }

  /**
   * The `TableSection` class maps all or - if `filter()` is overwritten - a
   * subset of the underlying UCI configuration sections of a given type.
   *
   * Layout wise, the configuration section instances mapped by the section
   * element (sometimes referred to as "section nodes") are rendered as rows
   * within an HTML table element, with an optional section remove button in the
   * last column and a section add button below the table, depending on the
   * value of the `addremove` property.
   */
  class TableSection extends TypedSection {
    /**
     * Enables a per-section instance row `Edit` button which triggers a certain
     * action when clicked. If set to a string, the string value is used as
     * `String.format()` pattern with the name of the underlying UCI section as
     * first format argument. The result is then interpreted as URL which LuCI
     * will navigate to when the user clicks the edit button.
     *
     * If set to a function, this function will be registered as click event
     * handler on the rendered edit button, receiving the section instance name
     * as first and the DOM click event as second argument.
     *
     * @defaultValue null
     */
    extedit: string | Function | null;

    /**
     * Specify a maximum amount of columns to display. By default, one table
     * column is rendered for each child option of the form section element.
     * When this option is set to a positive number, then no more columns than
     * the given amount are rendered. When the number of child options exceeds
     * the specified amount, a `More…` button is rendered in the last column,
     * opening a modal dialog presenting all options elements in `NamedSection`
     * style when clicked.
     *
     * @defaultValue null
     */
    max_cols: number | null;

    /**
     * Override the per-section instance modal popup title caption shown when
     * clicking the `More…` button in a section specifying `max_cols`.
     *
     * If set to a string, it will be used as `String.format()` pattern with the
     * name of the underlying UCI section as first argument, if set to a
     * function, the function will be invoked with the section name as first
     * argument and its return value is used as caption, after converting it to
     * a string.
     *
     * If this property is not set, the default is the name of the underlying
     * UCI configuration section.
     *
     * @defaultValue null
     */
    modaltitle: string | null;

    /**
     * If set to `true`, alternating `cbi-rowstyle-1` and `cbi-rowstyle-2` CSS
     * classes are added to the table row elements. Not all LuCI themes
     * implement these row style classes. The default is `false`.
     *
     * @defaultValue false
     */
    rowcolors: boolean;

    /**
     * Override the per-section instance title caption shown in the first column
     * of the table unless `anonymous` is set to true.
     *
     * If set to a string, it will be used as `String.format()` pattern with the
     * name of the underlying UCI section as first argument, if set to a
     * function, the function will be invoked with the section name as first
     * argument and its return value is used as caption, after converting it to
     * a string.
     *
     * If this property is not set, the default is the name of the underlying
     * UCI configuration section.
     *
     * @defaultValue null
     */
    sectiontitle: string | Function | null;

    /**
     * If set to `true`, a sort button is added to the last column, allowing the
     * user to reorder the section instances mapped by the section form element.
     *
     * @defaultValue false
     */
    sortable: boolean;

    /**
     * Add further options to the per-section instanced modal popup.
     *
     * This function may be overwritten by user code to perform additional setup
     * steps before displaying the more options modal which is useful to e.g.
     * query additional data or to inject further option elements.
     *
     * The default implementation of this function does nothing.
     *
     * @param modalSection - The `NamedSection` instance about to be rendered in
     * the modal popup.
     * @param section_id - The ID of the underlying UCI section the modal popup
     * belongs to.
     * @param ev - The DOM event emitted by clicking the `More…` button.
     */
    addModalOptions(
      modalSection: NamedSection,
      section_id: string,
      ev: Event
    ): any | Promise<any>;
  }

  /**
   * The `TextValue` class implements a multi-line textarea input using
   * `LuCI.ui.Textarea`.
   */
  class TextValue<S extends AbstractSection = AbstractSection> extends Value<
    string,
    S
  > {
    /**
     * Allows to specify the `cols` property of the underlying textarea widget.
     *
     * @defaultValue null
     */
    cols: number | null;

    /**
     * Enforces the use of a monospace font for the textarea contents when set
     * to `true`.
     *
     * @defaultValue false
     */
    monospace: boolean;

    /**
     * Allows to specify the `rows` property of the underlying textarea widget.
     *
     * @defaultValue null
     */
    rows: number | null;

    /**
     * Allows to specify the `wrap` property of the underlying textarea widget.
     *
     * @defaultValue null
     */
    wrap: number | null;
  }

  /**
   * The `TypedSection` class maps all or - if `filter()` is overwritten - a
   * subset of the underlying UCI configuration sections of a given type.
   *
   * Layout wise, the configuration section instances mapped by the section
   * element (sometimes referred to as "section nodes") are stacked beneath each
   * other in a single column, with an optional section remove button next to
   * each section node and a section add button at the end, depending on the
   * value of the `addremove` property.
   */
  class TypedSection extends AbstractSection {
    /**
     * Override the caption used for the section add button at the bottom of the
     * section form element. If set to a string, it will be used as-is, if set
     * to a function, the function will be invoked and its return value is used
     * as caption, after converting it to a string.
     *
     * If this property is not set, the default is `Add`.
     *
     * @defaultValue null
     */
    addbtntitle: string | Function | null;

    /**
     * If set to `true`, the user may add or remove instances from the form
     * section widget, otherwise only preexisting sections may be edited. The
     * default is `false`.
     *
     * @defaultValue false
     */
    addremove: boolean;

    /**
     * If set to `true`, mapped section instances are treated as anonymous UCI
     * sections, which means that section instance elements will be rendered
     * without title element and that no name is required when adding new
     * sections. The default is `false`.
     *
     * @defaultValue false
     */
    anonymous: boolean;

    /**
     * When set to `true`, instead of rendering section instances one below
     * another, treat each instance as separate tab pane and render a tab menu
     * at the top of the form section element, allowing the user to switch among
     * instances. The default is `false`.
     *
     * @defaultValue false
     */
    tabbed: boolean;

    /**
     * Override the UCI configuration name to read the section IDs from. By
     * default, the configuration name is inherited from the parent `Map`. By
     * setting this property, a deviating configuration may be specified.
     *
     * The default is `null`, means inheriting from the parent form.
     *
     * @defaultValue null
     */
    uciconfig: string | null;

    /**
     * Instantiate a TypedSection element.
     *
     * @param form - The configuration form this section is added to. It is
     * automatically passed by `section()`.
     * @param section_type - The type of the UCI section to map.
     * @param title - The title caption of the form section element.
     * @param description - The description text of the form section element.
     */
    constructor(
      form: Map | JSONMap,
      section_type: string,
      title?: string,
      description?: string
    );
  }

  /**
   * The `Value` class represents a simple one-line form input using the
   * `LuCI.ui.Textfield` or - in case choices are added - the `LuCI.ui.Combobox`
   * class as underlying widget.
   */
  class Value<
    T = string,
    S extends AbstractSection = AbstractSection
  > extends AbstractValue<T> {
    /**
     * If set to `true`, the field is rendered as password input, otherwise as
     * plain text input.
     *
     * @defaultValue false
     */
    password: boolean;

    /**
     * Set a placeholder string to use when the input field is empty.
     *
     * @defaultValue null
     */
    placeholder: string | null;

    /**
     * Instantiate a Value element.
     *
     * @param form - The configuration form this section is added to. It is
     * automatically passed by `option()` or `taboption()` when adding the
     * option to the section.
     * @param section - The configuration section this option is added to. It is
     * automatically passed by `option()` or `taboption()` when adding the
     * option to the section.
     * @param option - The name of the UCI option to map.
     * @param title - The title caption of the option element.
     * @param description - The description text of the option element.
     */
    constructor(
      form: Map | JSONMap,
      section: baseclass.Newable<S>,
      option: string,
      title?: string,
      description?: string
    );

    /**
     * Add a predefined choice to the form option. By adding one or more
     * choices, the plain text input field is turned into a combobox widget
     * which prompts the user to select a predefined choice, or to enter a
     * custom value.
     *
     * @param key - The choice value to add.
     * @param value - The caption for the choice value. May be a DOM node, a
     * document fragment or a plain text string. If omitted, the `key` value is
     * used as caption.
     */
    value(key: string, value: Node | string): void;
  }
}
