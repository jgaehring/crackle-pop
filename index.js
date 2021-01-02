const cracklePop = [
  [3, 'Crackle'],
  [5, 'Pop'],
];

const fizzBuzz = [
  [3, 'Fizz'],
  [7, 'Buzz'],
];

const h1 = document.querySelector('h1');
const list = document.querySelector('ul');
const controls = document.getElementById('controls');

const createElement = (tag, content, attrs = {}) => {
  const el = document.createElement(tag);
  el.append(content);
  Object.entries(attrs).forEach(([key, val]) => {
    el.setAttribute(key, val);
  })
  return el;
};

function run(start, end, loop, pop, current = start) {
  let num = current;
  let isLoop = loop;
  let isPop = pop;
  const pairs = isPop ? cracklePop : fizzBuzz;
  const counter = makeCounter(pairs);
  console.log('hello');
  const count = counter(start, end, current);
  
  const increment = () => {
    const next = count.next(isLoop).value || 'fin';
    h1.innerHTML = next;
    h1.className = `${next}`.toLowerCase();
    num += 1;
  };
  increment();
  h1.onclick = increment;

  const print = createElement('a', 'Print all.', { href: '#' });
  list.appendChild(print);
  print.onclick = () => {
    print.remove();
    for (const i of counter(start, end)) {
      const li = createElement('li', `${i}`);
      list.appendChild(li);
    }
  };
  
  const loopEl = createElement('span', isLoop ? '🔁' : '🛑');
  controls.appendChild(loopEl);
  loopEl.onclick = () => {
    isLoop = !isLoop;
    loopEl.innerHTML = isLoop ? '🔁' : '🛑';
  };

  const toggle = createElement('span', isPop ? '🍿' : '🐝');
  controls.appendChild(toggle);
  toggle.onclick = () => {
    if (num <= end || isLoop) {
      isPop = !isPop
      toggle.innerHTML = isPop ? '🍿' : '🐝';
      list.replaceChildren();
      controls.replaceChildren();
      const next = num <= end ? num - 1 : start;
      run(start, end, isLoop, isPop, next);
    } 
  };
}

h1.addEventListener('click', () => run(1, 100, true, true), { once: true });
