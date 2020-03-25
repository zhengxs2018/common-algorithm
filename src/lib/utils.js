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
  if (isNullOrUndefined(obj)) return false
  return typeof obj === 'object' && !Array.isArray(obj)
}

export function isNullOrUndefined(obj) {
  return typeof obj === undefined || obj === null
}
