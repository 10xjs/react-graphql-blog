// test
import {extendable} from '/util/class';
/**
 * RollingMap implements a Map subclass with a maximum size. Old entries are
 * removed as new entires are added when the maximum size is reached.
 */
export class RollingMap<K, V> extends extendable(Map)<K, V> {
  private _maxSize: number;

  constructor(maxSize: number, entries?: Readonly<Readonly<[K, V]>[]> | null) {
    super(entries);
    this._maxSize = maxSize;
  }

  get maxSize() {
    return this._maxSize;
  }

  set maxSize(maxSize: number) {
    this._maxSize = maxSize;
    this._trim();
  }

  private _trim() {
    if (this.size > this.maxSize) {
      this.delete(this.keys().next().value);
    }
  }

  set(key: K, value: V) {
    Map.prototype.set.call(this, key, value);
    this._trim();
    return this;
  }
}
