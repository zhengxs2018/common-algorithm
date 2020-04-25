/**  @module util */

const hasOwnProperty = Object.prototype.hasOwnProperty

/**
 * 判断对象是否包含某个 key
 *
 * @private
 *
 * @param target    目标对象
 * @param key       需要判断的 key
 */
export function hasOwn(
  target: unknown | Record<string | number | symbol, unknown>,
  key: string | number
): boolean {
  if (isNil(target)) return false
  return hasOwnProperty.call(target, key)
}

/** 排除一个字段，不会修改原始对象
 *
 * @private
 *
 * @param target   目标对象
 * @param key      需要排除的值
 *
 * @returns        已经排除字段的值
 */
export function omit<
  T extends Record<string | number | symbol, unknown>,
  K extends string | number
>(target: T, key: K): Omit<T, K> {
  // copy
  const data = Object.assign({}, target)

  if (hasOwn(data, key)) {
    delete data[key]
  }

  return data
}

/** 简单的断言函数
 *
 * @private
 *
 * @param value    断言的值
 * @param message  错误消息
 *
 * @throws {Error} 当 value 为 false 抛出错误
 */
/* istanbul ignore next */
export function assert(value: boolean, message: string | Error): void {
  if (value) return

  if (message instanceof Error) {
    throw message
  }

  throw new Error(message)
}

/**
 * 检查 value 是否是 null 或者 undefined
 *
 * @private
 *
 * @param value 要检查的值
 *
 * @returns 如果 value 为null 或 undefined，那么返回 true，否则返回 false。
 */
export function isNil(value: unknown): value is undefined | null {
  return value === undefined || value === null
}

/**
 * 检查 value 是否是函数
 *
 * @private
 *
 * @param value 要检查的值
 *
 * @returns 如果 value 函数，那么返回 true，否则返回 false。
 */
export function isFunction(value: unknown): value is Function {
  return typeof value === 'function'
}

/**
 * 检查 value 是否为 Object
 *
 * @private
 *
 * @param value 要检查的值
 *
 * @returns 如果 value 为一个对象，那么返回 true，否则返回 false
 */
export function isObject(
  value: unknown
): value is Record<string | number, any> {
  /* istanbul ignore next */
  if (isNil(value)) return false
  return typeof value === 'object' && !Array.isArray(value)
}

/**
 * 获取值的长度
 *
 * @private
 *
 * @param value  要获取长度的值
 *
 * @returns 长度
 */
export function size(value: unknown): number {
  if (isNil(value)) return 0
  return Object(value).length >>> 0
}

/**
 * 数组循环
 *
 * @private
 *
 * @param array     数组
 * @param callback  回调函数
 */
export function forEach<T = unknown>(
  array: T[],
  callback: (value: T, index: number, array: T[]) => boolean | void
): void {
  const length = array.length

  for (let index = 0; index < length; index++) {
    if (callback(array[index], index, array) === false) {
      break
    }
  }
}

/**
 * 创建字段匹配器
 *
 * @private
 *
 * @param include  需要包含的字段
 * @param exclude  需要排除的字段
 */
export function createIncludes(include: string[], exclude: string[]) {
  const contains = [
    include.length === 0
      ? () => true
      : (key: string) => include.indexOf(key) > -1,
    exclude.length === 0
      ? () => true
      : (key: string) => exclude.indexOf(key) === -1
  ]

  return (data: Record<string | number, unknown>, key: string) => {
    return hasOwn(data, key) && contains.every(has => has(key))
  }
}
