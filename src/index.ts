import 'reflect-metadata';

const symbol = Symbol('autobind');

function getProps(target: object, initial?: Property[], callback?: (target: object, props: Property[]) => void) {
  let props: Property[] = Reflect.getMetadata(symbol, target);
  if (!props) {
    props = initial;
    if (props) {
      Reflect.defineMetadata(symbol, props, target);
    }
    if (callback) {
      callback(target, props);
    }
  }
  return props
}

function bindProps(context: object, props: Property[]) {
  if (props) {
    props.forEach(({ name, params }) => context[name] = context[name].bind(context, ...params));
  }
}

function hookConstructor(target: any, props: Property[]) {
  while (!target.__proto__.toString().startsWith('function')) {
    target = target.__proto__;
  }
  const constructor = target.__proto__;
  target.__proto__ = function () {
    constructor.apply(this, arguments);
    bindProps(this, props)
  }
}

export function autobind(...params: unknown[]) {
  return (target: any, property: string) => {
    const props = getProps(target.constructor, [ ], hookConstructor);
    props.push({ name: property, params });
  }
}

export function markToBind(...params: unknown[]) {
  return ({ constructor: { prototype } }: any, property: string) => {
    const props = getProps(prototype, [ ]);
    props.push({ name: property, params });
  }
}

export function startBind(instance: object) {
  const props: Property[] = getProps((instance as any).__proto__);
  bindProps(instance, props)
}

interface Property {
  name: string
  params: unknown[]
}
