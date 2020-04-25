import { deepStrictEqual, ok } from 'power-assert'

import { hasOwn, omit, size, isNil, isObject, isFunction } from '../src/utils'

const toString = Object.prototype.toString

describe('test util.js', function() {
  it('test omit()', function() {
    const origin = { id: 1, parentId: 2 }
    const data = omit(origin, 'parentId')

    deepStrictEqual(data, { id: 1 }, 'omit 方法排除字段失败')
    deepStrictEqual(
      origin,
      { id: 1, parentId: 2 },
      'omit 方法误删除原始数据字段'
    )
  })

  it('test hasOwn()', function() {
    const cases: [unknown | Record<string, unknown>, string, boolean][] = [
      [{ a: 1 }, 'a', true],
      [{ b: 1 }, 'a', false],
      [null, 'a', false],
      [undefined, 'a', false],
      ['', 'a', false],
      [true, 'a', false],
      [{}, 'a', false],
      [[], 'a', false],
      [() => void 0, 'a', false]
    ]

    cases.forEach(([target, key, expected]) => {
      ok(
        hasOwn(target, key) === expected,
        `值 "${toString.call(target)}" 判断失败`
      )
    })
  })

  it('test isNil()', function() {
    const cases: [unknown, boolean][] = [
      [null, true],
      [undefined, true],
      ['', false],
      [true, false],
      [{}, false],
      [[], false],
      [() => void 0, false]
    ]

    cases.forEach(([value, expected]) => {
      const result = isNil(value)
      ok(result === expected, `值 "${toString.call(value)}" 判断失败`)
    })
  })

  it('test isFunction()', function() {
    const cases: [unknown, boolean][] = [
      [null, false],
      [undefined, false],
      ['', false],
      [true, false],
      [{}, false],
      [[], false],
      [() => void 0, true]
    ]

    cases.forEach(([value, expected]) => {
      ok(
        isFunction(value) === expected,
        `值 "${toString.call(value)}" 判断失败`
      )
    })
  })

  it('test isObject()', function() {
    const cases: [unknown, boolean][] = [
      [null, false],
      [undefined, false],
      ['', false],
      [true, false],
      [{}, true],
      [[], false],
      [() => void 0, false]
    ]

    cases.forEach(([value, expected]) => {
      ok(isObject(value) === expected, `值 "${toString.call(value)}" 判断失败`)
    })
  })

  it('test size()', function() {
    const cases: [unknown, number][] = [
      [null, 0],
      [undefined, 0],
      ['1', 1],
      [true, 0],
      [{ length: 1 }, 1],
      [{}, 0],
      [[], 0],
      [() => void 0, 0]
    ]

    cases.forEach(([value, expected]) => {
      ok(
        size(value) === expected,
        `值 "${toString.call(value)}" 的长度获取失败`
      )
    })
  })
})
