function Atom(val) {
  let value;
  let listeners = [];

  this.get = () => value;

  this.set = fn => {
    const prev = value;
    value = fn(prev);
    listeners.forEach(l => l(fn(prev)));
  };

  this.subscribe = fn => {
    listeners.push(fn);
    return () => {
      listeners = listeners.filter(l => fn === l);
    };
  };

  const nonCollections = ['number', 'string', 'boolean', 'function'];
  if (nonCollections.includes(typeof val) || !val) {
    value = val;
  } else if (Array.isArray(val)) {
    value = val.map(v => new Atom(v));
  } else {
    value = {};
    Object.keys(val).forEach(k => {
      value[k] = new Atom(val[k]);
    });
  }
}
