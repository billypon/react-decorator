import 'reflect-metadata';

const symbol = Symbol('autobind');

export function autobind(...params: any[]) {
  return (target: any, propertyKey: string) => {
    let properties: string[] = Reflect.getMetadata(symbol, target);
    if (!properties) {
      properties = [ ];
      Reflect.defineMetadata(symbol, properties, target);
      const constructor = target.constructor.__proto__;
      target.constructor.__proto__ = function () {
        constructor.apply(this, arguments);
        properties.forEach((x: string) => this[x] = this[x].bind(this, ...params));
      }
    }
    properties.push(propertyKey);
  }
}
