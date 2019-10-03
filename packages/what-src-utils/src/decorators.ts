
/**
 *
 *
 * @returns
 */
export const debug = (type: 'method' | 'class' | 'function' = 'method') => {
  switch (type) {
    case 'method': {
      return function(target: Object, name: string | symbol, descriptor: PropertyDescriptor) {
        const original = descriptor.value

        descriptor.value = function(...args: any[]) {
          console.log(`  ${target.constructor.name}.${String(name)} called with args -> ${args.join(', ')}`)
          const result = original.apply(this, args)
          console.log(`  ${target.constructor.name}.${String(name)} returned -> ${result}`)
          return result
        }

        return descriptor
      }
    }
    default: throw new Error(`Type: "${type}" not implemented yet. Choose one of [method] for now.`)
  }
}
