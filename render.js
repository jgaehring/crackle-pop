function h(tag, data = {}, children = []) {
  return { tag, data, children };
}

const findNodeByRef = (ref, parent) => {
  for (const child of parent.childNodes) {
    const childRef = child.getAttribute('ref');
    if (ref === childRef) {
      return child;
    }
  }
};

function render(vNode, parentDomNode, oldDomNode, parentProps = []) {
  // Pull these out early before passing props to the component.
  const { props, ref } = vNode.data || {};
  // If the tag is a function, it's a component, so pass it props.
  const vNodeHTML = typeof vNode.tag === 'function'
    ? vNode.tag(vNode.data.props)
    : vNode;
  // Reassigning the param should be fine, since we only do it if its undefined.
  oldDomNode = oldDomNode || findNodeByRef(ref, parentDomNode);
  // Use the original node, if one exists, or create a new one.
  const el = oldDomNode || document.createElement(vNodeHTML.tag);
  // Separate the events and throw out the props, b/c we already have them but
  // don't want them added as attributes.
  const { events = {}, props: _, ...attrs } = vNodeHTML.data;
  // Subscribe to the props, but not if a parent node already has, so we don't
  // unnecessarily rerender.
  if (props instanceof Atom && !parentProps.some(p => p === props)) {
    props.subscribe(update => {
      const updatedNode = {
        ...vNode,
        data: {
          ...vNode.data,
          props: new Atom(update),
        },
      };
      render(updatedNode, parentDomNode, el);
    });
  }
  if (ref) { el.setAttribute('ref', ref); }
  Object.entries(attrs).forEach(([k, v]) => {
    el.setAttribute(k, v);
  });
  Object.entries(events).forEach(([event, fn]) => {
    el[event] = fn;
  });
  // If there was no old node, the element hasn't been added to the DOM yet.
  if (!oldDomNode) {
    parentDomNode.appendChild(el);
  }
  if (Array.isArray(vNodeHTML.children)) {
    vNodeHTML.children.forEach(child => {
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
        const newParentProps = props instanceof Atom
          ? parentProps.concat(props)
          : parentProps;
        render(child, el, undefined, newParentProps);
      }
    });
  }
}
