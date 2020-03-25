/**
 * 笛卡儿积
 *
 * @module descartes
 *
 * @author zhengxs<zhengxs2018@foxmail.com>
 * @license MIT
 */

/**
 * 将对象转成笛卡儿积
 *
 * @param {Object}   data      原始对象
 * @param {Object}   options   可选配置
 * @param {String[]} options.includes  仅保留的字段
 * @param {String[]} options.excludes  仅排除的字段
 * @param {Function} options.convert   对生成结果进行二次转换的函数
 *
 * @returns {Array}
 *
 * @example
 *
 * fromObject({ color: ['red', 'blue'], size: ['22#'] })
 * // [{"color":"red","size":"22#"},{"color":"blue","size":"22#"}]
 */
export function fromObject(data, options) {
  // 处理异常数据
  data = Object(data)

  const { includes, excludes, convert = n => n } = options || {}

  const contains = [
    key => key in data,
    createIncludesFactory(includes || []),
    createIncludesFactory(excludes || [], true)
  ]

  const keys = Object.keys(data).filter(key => contains.every(has => has(key)))

  return fromArray(keys.map(key => data[key])).reduce((previous, current) => {
    const row = {}

    keys.forEach(function(key, i) {
      row[key] = current[i]
    })

    return previous.concat(convert(row))
  }, [])
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
export function fromArray(values) {
  if (Object(values).length >>> 0 === 0) return []

  const size = values.length - 1
  const results = []

  const recursive = (previous, currentIndex) => {
    const first = values[currentIndex]
    const last = currentIndex === size

    first.forEach(value => {
      const copy = previous.slice(0).concat(value)
      if (last) {
        results.push(copy)
      } else {
        recursive(copy, currentIndex + 1)
      }
    })
  }

  recursive([], 0)

  return results
}

export default {
  fromObject,
  fromArray
}

/**
 * 创建用于判断数组中是否包含某一个值的函数工程
 *
 * @private
 *
 * @param {Array}   arr              数组
 * @param {Boolean} [reverse=false]  逆转判断结果
 *
 * @returns {Function}      格式化函数
 */
function createIncludesFactory(arr, reverse = false) {
  if (arr.length === 0) return () => true

  return function include(valueOrFn) {
    const result = arr.some(
      typeof value === 'function' ? valueOrFn : v => v === valueOrFn
    )
    return reverse ? !result : result
  }
}
