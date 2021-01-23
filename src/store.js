import Atom from './Atom.js';

export const cracklePop = [
  [3, 'Crackle'],
  [5, 'Pop'],
];
export const fizzBuzz = [
  [3, 'Fizz'],
  [7, 'Buzz'],
];

const store = new Atom({
  count: 0,
  start: 1,
  end: 100,
  loop: false,
  pairs: cracklePop,
});

export default store;