declare namespace LuCI {
  class baseclass {
    __id__: number;
    __base__: Record<string, unknown>;
    __name__: string;
    __init__: (...args: any[]) => void;

    /**
     * Extends this base class with the properties described in `properties` and
     * returns a new subclassed Class instance
     *
     * @param properties - An object describing the properties to add to the new
     * subclass.
     *
     * @returns Returns a new LuCI.baseclass sublassed from this class, extended
     * by the given properties and with its prototype set to this base class to
     * enable inheritance. The resulting value represents a class constructor and
     * can be instantiated with `new`.
     */
    static extend<P extends Record<string, unknown> = Record<string, never>>(
      properties: P & Partial<LuCI.baseclass>
    ): LuCI.baseclass & P;

    /**
     * Calls the class constructor using `new` with the given argument array being
     * passed as variadic parameters to the constructor.
     *
     * @param params - An array of arbitrary values which will be passed as
     * arguments to the constructor function.
     * @param new_args - repeatable. Specifies arguments to be passed to the
     * subclass constructor as-is in order to instantiate the new subclass.
     *
     * @returns Returns a new LuCI.baseclass instance extended by the given
     * properties with its prototype set to this base class to enable inheritance.
     */
    static instantiate(params: any[], ...new_args: any[]): LuCI.baseclass;

    /**
     * Checks whether the given class value is a subclass of this class.
     *
     * @param classValue - The class object to test.
     *
     * @returns Returns `true` when the given classValue is a `subclass` of this
     * class or `false` if the given value is not a valid class or not a subclass
     * of this class'.
     */
    static isSubclass(classValue: any): boolean;

    /**
     * Extends this base class with the properties described in `properties`,
     * instantiates the resulting subclass using the additional optional arguments
     * passed to this function and returns the resulting subclassed Class
     * instance.
     *
     * This function serves as a convenience shortcut for `Class.extend()` and
     * subsequent `new`.
     *
     * @param properties - An object describing the properties to add to the new
     * subclass.
     * @param new_args - repeatable. Specifies arguments to be passed to the
     * subclass constructor as-is in order to instantiate the new subclass.
     *
     * @returns Returns a new LuCI.baseclass instance extended by the given
     * properties with its prototype set to this base class to enable inheritance.
     */
    static singleton(
      properties: Record<string, unknown>,
      ...new_args: any[]
    ): LuCI.baseclass;

    /**
     * Walks up the parent class chain and looks for a class member called `key`
     * in any of the parent classes this class inherits from. Returns the member
     * value of the superclass or calls the member as function and returns its
     * return value when the optional `callArgs` array is given.
     *
     * This function has two signatures and is sensitive to the amount of
     * arguments passed to it:
     * - `super('key')` - Returns the value of `key` when found within one of the
     *   parent classes.
     * - `super('key', ['arg1', 'arg2'])` - Calls the `key()` method with
     *   parameters `arg1` and `arg2` when found within one of the parent classes.
     *
     * @param key - The name of the superclass member to retrieve.
     * @param callArgs - An optional array of function call parameters to use.
     * When this parameter is specified, the found member value is called as
     * function using the values of this array as arguments.
     *
     * @throws Throws a {@link ReferenceError} when `callArgs` are specified and
     * the found member named by `key` is not a function value.
     *
     * @returns Returns the value of the found member or the return value of the
     * call to the found method. Returns `null` when no member was found in the
     * parent class chain or when the call to the superclass method returned
     * `null`.
     */
    super<T>(key: string, callArgs?: any[]): T | null;

    /**
     * Extract all values from the given argument array beginning from offset and
     * prepend any further given optional parameters to the beginning of the
     * resulting array copy.
     *
     * @param args - The array to extract the values from.
     * @param offset - The offset from which to extract the values. An offset of
     * `0` would copy all values till the end.
     * @param extra_args - repeatable. Extra arguments to add to prepend to the
     * resultung array.
     *
     * @returns Returns a new array consisting of the optional extra arguments and
     * the values extracted from the `args` array beginning with `offset`.
     */
    varargs<T>(args: T[], offset: number, ...extra_args: T[]): T[];
  }
}
