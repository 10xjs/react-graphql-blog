type Constructor = new (...args: any[]) => any;

const cache = new Map<Constructor, Constructor>();

/**
 * Wraps a native class to allow extending it in TypeScript.
 *
 * Similar to the `_wrapNativeSuper` babel helper.
 *
 * Inspired by a proposal at https://github.com/microsoft/TypeScript/issues/15397
 * @param Super built-in class constructor
 */
export function extendable<T extends Constructor>(Super: T): T {
  if (!/\{ \[native code\] \}$/.test(Function.toString.call(Super))) {
    return Super;
  }

  if (cache.has(Super)) {
    return cache.get(Super) as T;
  }

  function Extendable(this: any): any {
    const args: any = [Super];
    for (let i = 0; i < arguments.length; i++) {
      args[i + 1] = arguments[i];
    }
    var C = Super.bind.apply(Super, args);
    return Object.setPrototypeOf(new C(), this.constructor.prototype);
  }
  Object.setPrototypeOf(Extendable, Super);
  Extendable.prototype = Object.create(Super.prototype, {
    constructor: {
      value: Extendable,
      enumerable: true,
      configurable: true,
      writable: true,
    },
  });

  cache.set(Super, Extendable as any);

  return Extendable as any;
}
