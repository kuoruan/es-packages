declare namespace LuCI {
  class uci extends LuCI.baseclass {
    /**
     * Adds a new section of the given type to the given configuration, optionally
     * named according to the given name.
     *
     * @param config - The name of the configuration to add the section to.
     * @param type - The type of the section to add.
     * @param name - The name of the section to add. If the name is omitted, an
     * anonymous section will be added instead.
     *
     * @returns Returns the section ID of the newly added section which is
     * equivalent to the given name for non-anonymous sections.
     */
    add(config: string, type: string, name?: string): string;

    /**
     * Instructs the remote `ubus` UCI api to commit all saved changes with
     * rollback protection and attempts to confirm the pending commit operation to
     * cancel the rollback timer.
     *
     * @param timeout - Override the confirmation timeout after which a rollback
     * is triggered.
     *
     * @returns Returns a promise resolving/rejecting with the `ubus` RPC status
     * code.
     */
    apply(timeout?: number): Promise<number>;

    /**
     * Fetches uncommitted UCI changes from the remote `ubus` RPC api.
     *
     * @returns Returns a promise resolving to an object containing the
     * configuration names as keys and arrays of related change records as values.
     */
    changes(): Promise<{ [key: string]: LuCI.uci.ChangeRecord[] }>;

    /**
     * Generates a new, unique section ID for the given configuration.
     *
     * Note that the generated ID is temporary, it will get replaced by an
     * identifier in the form `cfgXXXXXX` once the configuration is saved by the
     * remote `ubus` UCI api.
     *
     * @param config - The configuration to generate the new section ID for.
     *
     * @returns A newly generated, unique section ID in the form `newXXXXXX` where
     * `X` denotes a hexadecimal digit.
     */
    createSID(config: string): string;

    /**
     * Gets the value of the given option within the specified section of the
     * given configuration or the entire section object if the option name is
     * omitted.
     *
     * @param config - The name of the configuration to read the value from.
     * @param sid - The name or ID of the section to read.
     * @param option - The option name to read the value from. If the option name
     * is omitted or `null`, the entire section is returned instead.
     *
     * @returns
     * - Returns a string containing the option value in case of a plain UCI
     *   option.
     * - Returns an array of strings containing the option values in case of
     *   `option` pointing to an UCI list.
     * - Returns a section object if the option argument has been omitted or is
     *   `null`.
     * - Returns `null` if the config, section or option has not been found or if
     *   the corresponding configuration is not loaded.
     */
    get<T = string | string[]>(
      config: string,
      sid: string,
      option: string
    ): T | null;
    get(config: string, sid: string): LuCI.uci.SectionObject | null;

    /**
     * Gets the value of the given option or the entire section object of the
     * first found section of the specified type or the first found section of the
     * entire configuration if no type is specfied.
     *
     * @param config - The name of the configuration to read the value from.
     * @param type - The type of the first section to find. If it is null, the
     * first section of the entire config is read, otherwise the first section
     * matching the given type.
     * @param option - The option name to read the value from. If the option name
     * is omitted or null, the entire section is returned instead.
     *
     * @returns
     * - Returns a string containing the option value in case of a plain UCI
     *   option.
     * - Returns an array of strings containing the option values in case of
     *   `option` pointing to an UCI list.
     * - Returns a `section object` if the `option` argument has been omitted or
     *   is `null`.
     * - Returns `null` if the config, section or option has not been found or if
     *   the corresponding configuration is not loaded.
     */
    get_first(
      config: string,
      type: string,
      option: string
    ): string | string[] | null;
    get_first(config: string, type?: string): LuCI.uci.SectionObject | null;

    /**
     * Loads the given UCI configurations from the remote `ubus` api.
     *
     * Loaded configurations are cached and only loaded once. Subsequent load
     * operations of the same configurations will return the cached data.
     *
     * To force reloading a configuration, it has to be unloaded with
     * `uci.unload()` first.
     *
     * @param config - The name of the configuration or an array of configuration
     * names to load.
     *
     * @returns Returns a promise resolving to the names of the configurations
     * that have been successfully loaded.
     */
    load(config: string | string[]): Promise<string[]>;

    /**
     * Move the first specified section within the given configuration before or
     * after the second specified section.
     *
     * @param config - The configuration to move the section within.
     * @param sid1 - The ID of the section to move within the configuration.
     * @param sid2 - The ID of the target section for the move operation. If the
     * `after` argument is `false` or not specified, the section named by `sid1`
     * will be moved before this target section, if the `after` argument is
     * `true`, the `sid1` section will be moved after this section.
     *
     * When the `sid2` argument is `null`, the section specified by `sid1` is
     * moved to the end of the configuration.
     * @param after - When `true`, the section `sid1` is moved after the section
     * `sid2`, when `false`, the section `sid1` is moved before `sid2`.
     *
     * If `sid2` is null, then this parameter has no effect and the section `sid1`
     * is moved to the end of the configuration instead.
     *
     * @returns Returns `true` when the section was successfully moved, or `false`
     * when either the section specified by `sid1` or by `sid2` is not found.
     */
    move(config: string, sid1: string, sid2?: string, after?: boolean): boolean;

    /**
     * Removes the section with the given ID from the given configuration.
     *
     * @param config - The name of the configuration to remove the section from.
     * @param sid - The ID of the section to remove.
     */
    remove(config: string, sid: string): void;

    /**
     * Resolves a given section ID in extended notation to the internal section ID
     * value.
     *
     * @param config - The configuration to resolve the section ID for.
     * @param sid - The section ID to resolve. If the ID is in the form
     * `@typename[#]`, it will get resolved to an internal anonymous ID in the
     * forms `cfgXXXXXX`/`newXXXXXX` or to the name of a section in case it points
     * to a named section. When the given ID is not in extended notation, it will
     * be returned as-is.
     *
     * @returns Returns the resolved section ID or the original given ID if it was
     * not in extended notation. Returns `null` when an extended ID could not be
     * resolved to existing section ID.
     */
    resolveSID(config: string, sid: string): string | null;

    /**
     * Submits all local configuration changes to the remove `ubus` api, adds,
     * removes and reorders remote sections as needed and reloads all loaded
     * configurations to resynchronize the local state with the remote
     * configuration values.
     *
     * @returns Returns a promise resolving to an array of configuration names
     * which have been reloaded by the save operation.
     */
    save(): Promise<string[]>;

    /**
     * Enumerates the sections of the given configuration, optionally filtered by
     * type.
     *
     * @param config - The name of the configuration to enumerate the sections
     * for.
     * @param type - Enumerate only sections of the given type. If omitted,
     * enumerate all sections.
     * @param cb - An optional callback to invoke for each enumerated section.
     *
     * @returns Returns a sorted array of the section objects within the given
     * configuration, filtered by type of a type has been specified.
     */
    sections(
      config: string,
      type?: string,
      cb?: LuCI.uci.sectionsFn
    ): LuCI.uci.SectionObject[];

    /**
     * Sets the value of the given option within the specified section of the
     * given configuration.
     *
     * If either config, section or option is null, or if `option` begins with a
     * dot, the function will do nothing.
     *
     * @param config - The name of the configuration to set the option value in.
     * @param sid - The name or ID of the section to set the option value in.
     * @param option - The option name to set the value for.
     * @param value - The option value to set. If the value is `null` or an empty
     * string, the option will be removed, otherwise it will be set or overwritten
     * with the given value.
     */
    set(
      config: string,
      sid: string,
      option: string,
      value: string | string[] | null
    ): void;

    /**
     * Sets the value of the given option within the first found section of the
     * given configuration matching the specified type or within the first section
     * of the entire config when no type has is specified.
     *
     * If either config, type or option is null, or if `option` begins with a dot,
     * the function will do nothing.
     *
     * @param config - The name of the configuration to set the option value in.
     * @param type - The type of the first section to find. If it is `null`, the
     * first section of the entire config is written to, otherwise the first
     * section matching the given type is used.
     * @param option - The option name to set the value for.
     * @param value - The option value to set. If the value is `null` or an empty
     * string, the option will be removed, otherwise it will be set or overwritten
     * with the given value.
     */
    set_first(
      config: string,
      type: string | null,
      option: string,
      value: string | string[] | null
    ): void;

    /**
     * Unloads the given UCI configurations from the local cache.
     *
     * @param config - The name of the configuration or an array of configuration
     * names to unload.
     */
    unload(config: string | string[]): void;

    /**
     * Remove the given option within the specified section of the given
     * configuration.
     *
     * This function is a convenience wrapper around
     * `uci.set(config, section, option, null)`.
     *
     * @param config - The name of the configuration to remove the option from.
     * @param sid - The name or ID of the section to remove the option from.
     * @param option - The name of the option to remove.
     */
    unset(config: string, sid: string, option: string): void;

    /**
     * Removes the given option within the first found section of the given
     * configuration matching the specified type or within the first section of
     * the entire config when no type has is specified.
     *
     * This function is a convenience wrapper around uci.set_first(config, type,
     * option, null).
     *
     * @param config - The name of the configuration to set the option value in.
     * @param type - The type of the first section to find. If it is `null`, the
     * first section of the entire config is written to, otherwise the first
     * section matching the given type is used.
     * @param option - The option name to set the value for.
     */
    unset_first(config: string, type: string | null, option: string): void;
  }

  namespace uci {
    /**
     * An UCI change record is a plain array containing the change operation name
     * as first element, the affected section ID as second argument and an
     * optional third and fourth argument whose meanings depend on the operation.
     */
    type ChangeRecord = {
      /**
       * The operation name - may be one of `add`, `set`, `remove`, `order`,
       * `list-add`, `list-del` or `rename`.
       */
      0:
        | "add"
        | "set"
        | "remove"
        | "order"
        | "list-add"
        | "list-del"
        | "rename";

      /**
       * The section ID targeted by the operation.
       */
      1: string;

      /**
       * The meaning of the third element depends on the operation.
       *
       * - For `add` it is type of the section that has been added
       * - For `set` it either is the option name if a fourth element exists, or
       *   the type of a named section which has been added when the change entry
       *   only contains three elements.
       * - For `remove` it contains the name of the option that has been removed.
       * - For `order` it specifies the new sort index of the section.
       * - For `list-add` it contains the name of the list option a new value has
       *   been added to.
       * - For `list-del` it contains the name of the list option a value has been
       *   removed from.
       * - For `rename` it contains the name of the option that has been renamed
       *   if a fourth element exists, else it contains the new name a section has
       *   been renamed to if the change entry only contains three elements.
       */
      2: string;

      /**
       * The meaning of the fourth element depends on the operation.
       *
       * - For `set` it is the value an option has been set to.
       * - For `list-add` it is the new value that has been added to a list
       *   option.
       * - For `rename` it is the new name of an option that has been renamed.
       */
      4: string;
    };

    /**
     * A section object represents the options and their corresponding values
     * enclosed within a configuration section, as well as some additional meta
     * data such as sort indexes and internal ID.
     *
     * Any internal metadata fields are prefixed with a dot which is isn't an
     * allowed character for normal option names.
     */
    type SectionObject = {
      /**
       * The `.anonymous` property specifies whether the configuration is
       * anonymous (`true`) or named (`false`).
       */
      [".anonymous"]: boolean;

      /**
       * The `.index` property specifes the sort order of the section.
       */
      [".index"]: number;

      /**
       * The `.name` property holds the name of the section object. It may be
       * either an anonymous ID in the form `cfgXXXXXX` or `newXXXXXX` with `X`
       * being a hexadecimal digit or a string holding the name of the section.
       */
      [".name"]: string;

      /**
       * The `.type` property contains the type of the corresponding uci section.
       */
      [".type"]: string;

      /**
       * A section object may contain an arbitrary number of further properties
       * representing the uci option enclosed in the section.
       *
       * All option property names will be in the form `[A-Za-z0-9_]+` and either
       * contain a string value or an array of strings, in case the underlying
       * option is an UCI list.
       */
      [key: string]: boolean | number | string | string[];
    };

    /**
     * The sections callback is invoked for each section found within the given
     * configuration and receives the section object and its associated name as
     * arguments.
     *
     * @param section - The section object.
     * @param sid - The name or ID of the section.
     */
    type sectionsFn = (section: SectionObject, sid: string) => void;
  }
}
