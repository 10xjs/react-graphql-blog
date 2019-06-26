/**
 * RollingMap implements a Map subclass with a maximum size. Old entries are
 * removed as new entires are added when the maximum size is reached.
 */
export class RollingMap<K, V> implements Map<K, V> {
  _maxSize: number;
  _map: Map<K, V>;

  // Proxied standar methods.

  clear() {
    this._map.clear();
  }

  delete(key: K) {
    return this._map.delete(key);
  }

  forEach(
    callbackfn: (value: V, key: K, map: Map<K, V>) => void,
    thisArg?: any,
  ) {
    this._map.forEach(callbackfn, thisArg);
  }

  get(key: K) {
    return this._map.get(key);
  }

  has(key: K) {
    return this._map.has(key);
  }

  get size() {
    return this._map.size;
  }

  entries() {
    return this._map.entries();
  }

  keys() {
    return this._map.keys();
  }

  values() {
    return this._map.values();
  }

  [Symbol.iterator]() {
    return this._map[Symbol.iterator]();
  }

  get [Symbol.toStringTag]() {
    return String(this._map[Symbol.toStringTag]);
  }

  // Overloaded standard methods.

  set(key: K, value: V) {
    this._map.set(key, value);
    this._trim();
    return this;
  }

  // Custom methods.

  get maxSize() {
    return this._maxSize;
  }

  set maxSize(maxSize: number) {
    this._maxSize = maxSize;
    this._trim();
  }

  _trim() {
    if (this._map.size > this.maxSize) {
      this._map.delete(this._map.keys().next().value);
    }
  }

  constructor(maxSize: number, entires?: Readonly<Readonly<[K, V]>[]> | null) {
    this._map = new Map(entires);
    this._maxSize = maxSize;
  }
}
