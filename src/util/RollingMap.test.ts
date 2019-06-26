import {RollingMap} from './RollingMap';

describe('RollingMap', () => {
  it('should behave like a Map', () => {
    const map = new RollingMap<string, string>(1);

    map.set('foo', 'bar');

    expect(map.has('foo')).toBe(true);
    expect(map.get('foo')).toBe('bar');
  });

  it('should limit the total number of entires', () => {
    const map = new RollingMap<string, string>(3);

    map.set('1', '1');
    map.set('2', '2');
    map.set('3', '3');
    map.set('4', '4');

    expect(map.size).toBe(3);
    expect(map.get('4')).toBe('4');
    expect(map.has('1')).toBe(false);
  });

  it('should trim size when the maxSize property is modified', () => {
    const map = new RollingMap<string, string>(4);

    map.set('1', '1');
    map.set('2', '2');
    map.set('3', '3');
    map.set('4', '4');

    expect(map.size).toBe(4);

    map.maxSize = 3;

    expect(map.size).toBe(3);
    expect(map.get('4')).toBe('4');
    expect(map.has('1')).toBe(false);
  });
});
