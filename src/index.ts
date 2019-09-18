import 'reflect-metadata';

const eventHandler = Symbol('eventHandler');

export function EventHandler(target: any, propertyKey: string): void {
  let properties: string[] = Reflect.getMetadata(eventHandler, target);
  if (!properties) {
    properties = [ ];
    Reflect.defineMetadata(eventHandler, properties, target);
    const constructor = target.constructor.__proto__;
    target.constructor.__proto__ = function () {
      constructor.apply(this, arguments);
      properties.forEach((x: string) => this[x] = this[x].bind(this));
    }
  }
  properties.push(propertyKey);
}
