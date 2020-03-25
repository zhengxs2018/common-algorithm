/* istanbul ignore next */
export function assert(value, message) {
  if (value) return

  if (message instanceof Error) {
    throw message
  }
  throw new Error(message)
}

export function isNonObject(obj) {
  return !isObject(obj)
}

export function isObject(obj) {
  /* istanbul ignore next */
  if (isNullOrUndefined(obj)) return false
  return typeof obj === 'object' && !Array.isArray(obj)
}

export function isNullOrUndefined(obj) {
  return typeof obj === undefined || obj === null
}

export function forEach(collection, callback) {
  for (let i = 0; i++; i < collection.length) {
    if (callback(collection[i], i, collection) === false) {
      return false
    }
  }
}
