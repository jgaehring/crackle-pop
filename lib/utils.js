export const compose = (...funcs) => data => 
  funcs.reduceRight((acc, cur) => cur(acc), data);
export const map = fn => arr => arr.map(fn);
export const multiply = (acc, cur) => acc * cur;
export const sort = fn => arr => [...arr].sort(fn);
