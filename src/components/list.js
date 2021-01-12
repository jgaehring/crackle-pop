import Atom from '../../lib/Atom.js';
import store from '../store.js';
import makeConverter from '../convert.js';

const list = {
  deps: {
    start: store.get().start,
    end: store.get().end,
    pairs: store.get().pairs,
    show: new Atom(false),
  },
  render(props) {
    const { start, end, pairs, show } = props;
    const convert = makeConverter(pairs);
    const range = [...new Array(end - start + 1)].map((_, i) => ({
      tag: 'li',
      children: [`${convert(start + i)}`],
    }));
    const print = [{
      tag: 'li',
      children: [{
        tag: 'a',
        attrs: { href: '#' },
        on: { click() { props.set('show', () => true); } },
        children: ['Print all.'],
      }]
    }]
    return {
      tag: 'ul',
      children: show ? range : print,
    };
  },
};

export default list;