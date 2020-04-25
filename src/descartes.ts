/** @module descartes 笛卡儿积 */

import { createIncludes, size } from './utils'

export type DescartesObject = Record<string, string | number | unknown>
export type DescartesArray = Array<string | number>

export interface FormObjectOptions {
  include: string[]
  exclude: string[]
  convert(data: DescartesObject): DescartesObject
}

/**
 * 将对象转成笛卡儿积
 *
 * @param data      原始对象
 * @param options   可选配置
 *
 * @returns 转换后的笛卡尔积数组
 *
 * @example
 *
 * fromObject({ color: ['red', 'blue'], size: ['22#'] })
 * // [{"color":"red","size":"22#"},{"color":"blue","size":"22#"}]
 */
export function toDescartesData(
  data: Record<string, Array<string | number>>,
  options?: Partial<FormObjectOptions>
): DescartesObject[] {
  const include = options?.include || []
  const exclude = options?.exclude || []
  const convert = options?.convert || (n => n)

  const keys: string[] = []
  const values: Array<string | number>[] = []

  const match = createIncludes(include, exclude)
  for (const key of Object.keys(data)) {
    if (match(data, key)) {
      keys.push(key)
      values.push(data[key])
    }
  }

  return toDescartesArray<DescartesObject>(values, value => {
    const data: DescartesObject = {}

    keys.forEach((key, i) => {
      data[key] = value[i]
    })

    return convert(data)
  })
}

/**
 * 将二维数组转成笛卡儿积数组
 *
 * @public
 *
 * @param {any[][]} values 二维数组
 *
 * @returns {Array}
 *
 * @example
 *
 * fromArray([['a', 'b'], ['c']])
 * // [["a","c"],["b","c"]]
 *
 * fromArray([['a', 'b'], ['c', 'd']])
 * // [["a","c"],["a","d"],["b","c"],["b","d"]]
 */
export function toDescartesArray<TResult = DescartesArray>(
  values: DescartesArray[],
  customizer?: (value: DescartesArray) => TResult
): TResult[] {
  if (size(values) === 0) return []

  const callback = customizer || ((v: unknown) => v as TResult)

  const length = values.length - 1
  const results: TResult[] = []

  function recursive(previous: DescartesArray, index: number) {
    const first = values[index]
    const end = index === length

    first.forEach(value => {
      const copy = previous.concat(value)
      if (end) {
        results.push(callback(copy))
      } else {
        recursive(copy, index + 1)
      }
    })
  }

  recursive([], 0)

  return results
}

export default {
  toObject: toDescartesData,
  toArray: toDescartesArray
}
