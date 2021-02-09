import 'reflect-metadata';

const symbol = Symbol('autobind');

interface Property {
  name: string
  params: any[]
}

export function markToBind(...params: any[]) {
  return ({ constructor: { prototype } }: any, propertyKey: string) => {
    let properties: Property[] = Reflect.getMetadata(symbol, prototype);
    if (!properties) {
      properties = [ ];
      Reflect.defineMetadata(symbol, properties, prototype);
    }
    properties.push({ name: propertyKey, params });
  }
}

export function startBind(instance: any) {
  const properties: Property[] = Reflect.getMetadata(symbol, instance.__proto__);
  if (properties) {
    properties.forEach(({ name, params }) => instance[name] = instance[name].bind(instance, ...params));
  }
}
