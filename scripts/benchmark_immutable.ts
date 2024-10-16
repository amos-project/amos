/*
 * @since 2024-10-15 11:44:41
 * @author junbao <junbao@moego.pet>
 */

import * as crypto from 'node:crypto';
import * as I from 'immutable';
import * as N from 'amos-shapes';
import { printTable } from 'console-table-printer';
import { range } from 'lodash';

const randKey = (size: number) => {
  return crypto
    .pseudoRandomBytes(size)
    .toString('base64')
    .replace(/[^a-z0-9]+/gi, '_');
};

const randInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const props: globalThis.Record<string, unknown> = {};

const propsSize = 1000;

for (let i = 0; i < propsSize; i++) {
  const len = randInt(3, 50);
  const key = randKey(len);
  props[key] = [
    null,
    true,
    randInt(0, Number.MAX_SAFE_INTEGER),
    randKey(22),
    false,
    { id: 123123, name: 'hello world', created_at: 1123123123 },
    Math.random(),
    [
      null,
      true,
      randInt(0, Number.MAX_SAFE_INTEGER),
      Math.random(),
      randKey(22),
      { id: 123123, name: 'hello world', created_at: 1123123123 },
    ],
    void 0,
  ][i % 9];
}

const propEntries = Object.entries(props);

const pickProps = (size: number) => {
  return Object.fromEntries(propEntries.slice(0, size));
};

const _shiftedProps = propEntries.map(([k], i) => [
  k,
  propEntries[i === propEntries.length - 1 ? 0 : i + 1],
]);

const shiftProps = (size: number) => {
  return Object.fromEntries(_shiftedProps.slice(0, size));
};

type Unit = (size: number) => (i: number) => void;

const benches: [name: string, immutable: Unit, native: Unit][] = [];

benches.push([
  'Object.define',
  (size) => {
    return () => {
      return I.Record(pickProps(size));
    };
  },
  (size) => {
    return () => {
      return N.Record(pickProps(size));
    };
  },
]);

benches.push([
  'Object.create',
  (size) => {
    const R = I.Record(pickProps(size));
    return () => {
      return new R(shiftProps(size));
    };
  },
  (size) => {
    const A = N.Record(pickProps(size));
    return () => {
      return new A(shiftProps(size));
    };
  },
]);

benches.push([
  'Object.set',
  (size) => {
    const r = new (I.Record(pickProps(size)))(shiftProps(size));
    return (i) => {
      const [key, value] = propEntries[i % size];
      return r.set(key, value);
    };
  },
  (size) => {
    const r = new (N.Record(pickProps(size)))(shiftProps(size));
    return (i) => {
      const [key, value] = propEntries[i % size];
      return r.set(key, value);
    };
  },
]);

benches.push([
  'Object.merge',
  (size) => {
    const r = new (I.Record(pickProps(size)))(shiftProps(size));
    return (i) => {
      return r.merge(pickProps(i % size));
    };
  },
  (size) => {
    const r = new (N.Record(pickProps(size)))(shiftProps(size));
    return (i) => {
      return r.merge(pickProps(i % size));
    };
  },
]);

benches.push([
  'Object.get',
  (size) => {
    const r = new (I.Record(pickProps(size)))(shiftProps(size));
    return (i) => {
      const [key] = propEntries[i % size];
      return r[key];
    };
  },
  (size) => {
    const r = new (N.Record(pickProps(size)))(shiftProps(size));
    return (i) => {
      const [key] = propEntries[i % size];
      return r[key];
    };
  },
]);

benches.push([
  'List.create',
  (size) => {
    return () => {
      return I.List<number>(range(size));
    };
  },
  (size) => {
    return () => {
      return new N.List<number>(0, range(size));
    };
  },
]);

benches.push([
  'List.push',
  (size) => {
    const v = I.List<number>(range(size));
    return (i) => {
      return v.push(...range(i));
    };
  },
  (size) => {
    const v = new N.List<number>(0, range(size));
    return (i) => {
      return v.push(...range(i));
    };
  },
]);

benches.push([
  'List.pop',
  (size) => {
    const v = I.List<number>(range(size));
    return () => {
      return v.pop();
    };
  },
  (size) => {
    const v = new N.List<number>(0, range(size));
    return () => {
      return v.pop();
    };
  },
]);

benches.push([
  'List.unshift',
  (size) => {
    const v = I.List<number>(range(size));
    return (i) => {
      return v.unshift(...range(i));
    };
  },
  (size) => {
    const v = new N.List<number>(0, range(size));
    return (i) => {
      return v.unshift(...range(i));
    };
  },
]);

benches.push([
  'List.shift',
  (size) => {
    const v = I.List<number>(range(size));
    return () => {
      return v.shift();
    };
  },
  (size) => {
    const v = new N.List<number>(0, range(size));
    return () => {
      return v.shift();
    };
  },
]);

benches.push([
  'List.concat',
  (size) => {
    const v = I.List<number>(range(size));
    return (i) => {
      return v.concat(range(i));
    };
  },
  (size) => {
    const v = new N.List<number>(0, range(size));
    return (i) => {
      return v.concat(range(i));
    };
  },
]);

benches.push([
  'List.map',
  (size) => {
    const v = I.List<number>(range(size));
    return (i) => {
      return v.map((v, i2) => v + i + i2);
    };
  },
  (size) => {
    const v = new N.List<number>(0, range(size));
    return (i) => {
      return v.map((v, i2) => v + i + i2);
    };
  },
]);

benches.push([
  'List.includes',
  (size) => {
    const v = I.List<number>(range(size));
    return (i) => {
      return v.includes(i);
    };
  },
  (size) => {
    const v = new N.List<number>(0, range(size));
    return (i) => {
      return v.includes(i);
    };
  },
]);

benches.push([
  'List.some',
  (size) => {
    const v = I.List<number>(range(size));
    return (i) => {
      return v.some((v) => v === i % size);
    };
  },
  (size) => {
    const v = new N.List<number>(0, range(size));
    return (i) => {
      return v.some((v) => v === i % size);
    };
  },
]);

benches.push([
  'List.every',
  (size) => {
    const v = I.List<number>(range(size));
    return (i) => {
      return v.every((v) => v === i % size);
    };
  },
  (size) => {
    const v = new N.List<number>(0, range(size));
    return (i) => {
      return v.every((v) => v === i % size);
    };
  },
]);

benches.push([
  'List.set',
  (size) => {
    const v = I.List<number>(range(size));
    return (i) => {
      return v.set(i % size, i);
    };
  },
  (size) => {
    const v = new N.List<number>(0, range(size));
    return (i) => {
      return v.set(i % size, i);
    };
  },
]);

benches.push([
  'List.splice',
  (size) => {
    const v = I.List<number>(range(size));
    return (i) => {
      return v.splice((i % size) / 2, (i % size) / 4, ...range(i % size));
    };
  },
  (size) => {
    const v = new N.List<number>(0, range(size));
    return (i) => {
      return v.splice((i % size) / 2, (i % size) / 4, ...range(i % size));
    };
  },
]);

benches.push([
  'List.get',
  (size) => {
    const v = I.List<number>(range(size));
    return (i) => {
      return v.get(i % size);
    };
  },
  (size) => {
    const v = new N.List<number>(0, range(size));
    return (i) => {
      return v.get(i % size);
    };
  },
]);

benches.push([
  'List.entries',
  (size) => {
    const v = I.List<number>(range(size));
    return (i) => {
      return v.entries();
    };
  },
  (size) => {
    const v = new N.List<number>(0, range(size));
    return (i) => {
      return v.entries();
    };
  },
]);

benches.push([
  'Map.create',
  (size) => {
    return (i) => {
      return I.Map(pickProps(size));
    };
  },
  (size) => {
    return (i) => {
      return new N.Map<string, unknown>(pickProps(0)).reset(pickProps(size));
    };
  },
]);

benches.push([
  'Map.set',
  (size) => {
    const m = I.Map(pickProps(size));
    return (i) => {
      return m.set(propEntries[i % propsSize][0], propEntries[i % propsSize][1]);
    };
  },
  (size) => {
    const m = new N.Map<string, unknown>(pickProps(0)).reset(pickProps(size));
    return (i) => {
      return m.set(propEntries[i % propsSize][0], propEntries[i % propsSize][1]);
    };
  },
]);

benches.push([
  'Map.merge',
  (size) => {
    const m = I.Map(pickProps(size));
    return (i) => {
      return m.merge(propEntries.slice(0, i));
    };
  },
  (size) => {
    const m = new N.Map<string, unknown>(pickProps(0)).reset(pickProps(size));
    return (i) => {
      return m.merge(propEntries.slice(0, i));
    };
  },
]);

benches.push([
  'Map.get',
  (size) => {
    const m = I.Map(pickProps(size));
    return (i) => {
      return m.get(propEntries[(i % size) + 1][0]);
    };
  },
  (size) => {
    const m = new N.Map<string, unknown>(pickProps(0)).reset(pickProps(size));
    return (i) => {
      return m.get(propEntries[(i % size) + 1][0]);
    };
  },
]);

benches.push([
  'Map.clear',
  (size) => {
    const m = I.Map(pickProps(size));
    return (i) => {
      return m.clear();
    };
  },
  (size) => {
    const m = new N.Map<string, unknown>(pickProps(0)).reset(pickProps(size));
    return (i) => {
      return m.clear();
    };
  },
]);

const results: string[][] = [];

const sizes = [10, 20, 50, 100];
results.push(['method', ...sizes.map((s) => ['i-' + s, 'n-' + s, '-%', '']).flat()]);

let now: bigint;

const count = 10000;

const diff = (ti: bigint, tn: bigint) => {
  const i = +ti.toString();
  const n = +tn.toString();
  return ((i / n - 1) * 100).toFixed(2);
};

for (const [name, immutable, native] of benches) {
  const line = [name];
  results.push(line);
  for (const size of [10, 20, 50, 100]) {
    now = process.hrtime.bigint();
    const fi = immutable(size);
    const fn = native(size);
    now = process.hrtime.bigint();
    for (let i = 0; i < count; i++) {
      fi(i);
    }
    const ti = (process.hrtime.bigint() - now) / 1000n;
    now = process.hrtime.bigint();
    for (let i = 0; i < count; i++) {
      fn(i);
    }
    const tn = (process.hrtime.bigint() - now) / 1000n;
    line.push(ti + '', tn + '', diff(ti, tn), '');
  }
}

printTable(results);
