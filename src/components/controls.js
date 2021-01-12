import store, { cracklePop, fizzBuzz } from '../store.js';

const popControl = {
  deps: {
    pairs: store.get().pairs,
  },
  render(props) {
    const isPop = props.pairs[1][1] === 'Pop';
    const icon = isPop ? '🐝' : '🍿';
    return {
      tag: 'span',
      on: {
        click() { props.set('pairs', () => isPop ? fizzBuzz : cracklePop); },
      },
      children: [icon],
    };
  },
};

const loopControl = {
  deps: {
    loop: store.get().loop,
  },
  render(props) {
    const icon = props.loop ? '🛑' : '🔁';
    return {
      tag: 'span',
      on: {
        click() { props.set('loop', (bool) => !bool); },
      },
      children: [icon],
    };
  },
};

const controls = {
  tag: 'div',
  attrs: { id: 'controls' },
  children: [popControl, loopControl],
};

export default controls;
