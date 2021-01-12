import store from '../store.js';
import makeConverter from '../convert.js';

const heading = {
  deps: {
    count: store.get().count,
    start: store.get().start,
    end: store.get().end,
    loop: store.get().loop,
    pairs: store.get().pairs,
  },
  render(props) {
    let string;
    if (props.count < props.start) {
      string = '🖱️';
    } else if (props.count > props.end) {
      string = 'fin'
    } else {
      const convert = makeConverter(props.pairs);
      string = convert(props.count).toString();
    }
    const inc = c => {
      const sum = c + 1;
      if (sum <= props.end || !props.loop) {
        return sum;
      }
      return props.start;
    }
    return {
      tag: 'h1',
      attrs: { class: string.toLowerCase() },
      on: { click() { props.set('count', inc); } },
      children: [string],
    };
  },
};

export default heading;
