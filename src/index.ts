import 'reflect-metadata';

const autobindSymbol = Symbol('autobind');

export function autobind(target: any, propertyKey: string): void {
  let properties: string[] = Reflect.getMetadata(autobindSymbol, target);
  if (!properties) {
    properties = [ ];
    Reflect.defineMetadata(autobindSymbol, properties, target);
    const constructor = target.constructor.__proto__;
    target.constructor.__proto__ = function () {
      constructor.apply(this, arguments);
      properties.forEach((x: string) => this[x] = this[x].bind(this));
    }
  }
  properties.push(propertyKey);
}
