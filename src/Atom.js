const nonCollections = ['number', 'string', 'boolean', 'function'];

// An observable data structure _loosely_ based on Clojure atoms.
export default function Atom(val) {
  let value;
  let listeners = new Map();

  // Used for both initializing and setting the value.
  const assignValue = v => {
    if (nonCollections.includes(typeof v) || !v) {
      value = v;
    } else if (Array.isArray(v)) {
      value = v.map((_v, i) => new Atom(_v, value, i));
    } else {
      value = {};
      Object.keys(v).forEach(k => {
        value[k] = new Atom(v[k], value, k);
      });
    }
  };

  // Freezing the value after initializing it,
  // but it can still be reassigned.
  assignValue(val);
  Object.freeze(value);

  this.get = () => {
    if (nonCollections.includes(typeof value)) {
      return value;
    }
    // Make sure not to mutate collections.
    if (Array.isArray(value)) {
      return [...value];
    }
    return { ...value };
  };

  this.set = (fn) => {
    const next = Object.freeze(fn(this.get()));
    assignValue(next);
    // Make a duplicate so we can clear the listeners
    // BEFORE we call them. This prevents infinite loops.
    const dupListeners = new Map(listeners);
    listeners.clear();
    dupListeners.forEach((v, k) => { v(next); })
  };

  this.subscribe = (fn, ref) => {
    if (typeof fn !== 'function') {
      throw new Error('Subscriber is not a function.');
    }
    listeners.set(ref, fn);
    return () => {
      listeners.delete(ref);
    };
  };
}

// Turns an atom back into a normal value.
export const getAtomValue = val => {
  let atomValue;

  if (val instanceof Atom) {
    atomValue = val.get();
  } else if (nonCollections.includes(typeof val)) {
    atomValue = val;
    // Once again, avoid mutations.
  } else if (Array.isArray(val)) {
    atomValue = [...val];
  } else {
    atomValue = { ...val };
  }

  if (nonCollections.includes(typeof atomValue)) {
    return atomValue;
  }
  if (Array.isArray(atomValue)) {
    return atomValue.map(getAtomValue);
  }
  Object.keys(atomValue).forEach(k => {
    atomValue[k] = getAtomValue(atomValue[k]);
  });
  return atomValue;
};
