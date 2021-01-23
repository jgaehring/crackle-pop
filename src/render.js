import Atom, { getAtomValue } from './Atom.js';

let refCounter = 0;

export default function render(component, mount, oldElement, parentDeps) {
  if ('tag' in component) {
    const { tag, attrs = {}, on = {}, children = [] } = component;
    const el = oldElement || document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      el.setAttribute(k, v);
    });
    Object.entries(on).forEach(([event, handler]) => {
      el.addEventListener(event, handler, { once: true });
    });
    if (!oldElement) {
      mount.appendChild(el);
    } else {
      el.replaceChildren();
    }
    children.forEach(child => {
      if (typeof child === 'string') {
        // Handle text nodes first, before passing to render.
        const text = document.createTextNode(child);
        const textNode = el.childNodes[0];
        if (textNode) {
          textNode.replaceWith(text);
        } else {
          el.appendChild(text);
        }
      } else {
        render(child, el, undefined, parentDeps);
      }
    });
    // Return the element so we can use it below.
    return el;
  } else if ('render' in component) {
    if (!('ref' in component)) {
      component.ref = refCounter++
    }
    const { deps = {}, render: renderMethod, ref } = component;
    const props = getAtomValue(deps);
    // This exposes a simple method on props for setting dependencies.
    // So basically, in the component you can call:
    // props.set('foo', 'bar', x => x + 1);
    // which becomes:
    // atom.get().foo.get().bar.set(x => x + 1);
    props.set = (...args) => {
      const fn = args.slice(args.length - 1)[0];
      const keys = args.slice(0, args.length - 1);
      const observer = keys.reduce((dep, key) => {
        if (dep instanceof Atom) {
          return dep.get()[key];
        }
        return dep[key];
      }, deps);
      observer.set(fn);
    };
    const htmlComponent = renderMethod(props);
    const el = render(htmlComponent, mount, oldElement, parentDeps);
    // Last but not least, subscribe to all changes to the component's
    // dependencies, unless a parent node has already subscribed.
    // We're doing this a little late, because we need to be able to pass
    // the original element when the subscriber rerenders.
    Object.values(deps).forEach(dep => {
      if (dep instanceof Atom && (!parentDeps || !parentDeps.has(dep))) {
        dep.subscribe((update) => {
          // Make sure to clear the event listners before rerendering.
          Object.entries(htmlComponent.on || {}).forEach(([event, handler]) => {
            el.removeEventListener(event, handler);
          })
          render(component, mount, el);
        }, ref);
        parentDeps = parentDeps ? new Set(parentDeps).add(dep) : new Set().add(dep);
      }
    });
    // Probably don't have to return here, but for the sake of consistency.
    return el;
  } else {
    throw new Error('Cannot render. Components must have a tag or deps property.')
  }
}
