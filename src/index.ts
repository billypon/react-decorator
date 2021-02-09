import 'reflect-metadata';

const symbol = Symbol('autobind');

function getProps(target: object, initial?: Property[]) {
  let props: Property[] = Reflect.getMetadata(symbol, target);
  if (!props) {
    props = initial;
    if (props) {
      Reflect.defineMetadata(symbol, props, target);
    }
  }
  return props
}

function bindProps(context: object, props: Property[]) {
  if (props) {
    props.forEach(({ name, params }) => context[name] = context[name].bind(context, ...params));
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
