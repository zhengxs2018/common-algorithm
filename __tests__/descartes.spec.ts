import { deepStrictEqual } from 'power-assert'

import { toDescartesData, toDescartesArray } from '../src/descartes'

describe('test descartes.js', function() {
  it('test toDescartesData()', function() {
    const data = { color: ['red', 'blue'], size: ['22#'] }

    deepStrictEqual(
      toDescartesData(data),
      [
        { color: 'red', size: '22#' },
        { color: 'blue', size: '22#' }
      ],
      '笛卡儿积数组生成失败'
    )
  })

  it('test toDescartesData(include)', function() {
    const data = { color: ['red', 'blue'], size: ['22#'] }

    deepStrictEqual(
      toDescartesData(data, { include: ['color'] }),
      [{ color: 'red' }, { color: 'blue' }],
      '出现冗余字段或处理失败'
    )
  })

  it('test toDescartesData(exclude)', function() {
    const data = { color: ['red', 'blue'], size: ['22#'] }

    deepStrictEqual(
      toDescartesData(data, { exclude: ['size'] }),
      [{ color: 'red' }, { color: 'blue' }],
      '字段未成功排除'
    )
  })

  it('test toDescartesData(convert)', function() {
    const data = { color: ['red', 'blue'], size: ['22#'] }

    deepStrictEqual(
      toDescartesData(data, {
        include: ['color'],
        convert(data) {
          data.__convert__ = true
          return data
        }
      }),
      [
        { color: 'red', __convert__: true },
        { color: 'blue', __convert__: true }
      ],
      '数据转换失败'
    )
  })

  it('test toDescartesArray(cases)', function() {
    const cases = [
      [
        [['a', 'b'], ['c']],
        [
          ['a', 'c'],
          ['b', 'c']
        ]
      ],
      [
        [
          ['a', 'b'],
          ['c', 'd']
        ],
        [
          ['a', 'c'],
          ['a', 'd'],
          ['b', 'c'],
          ['b', 'd']
        ]
      ],
      [[['a'], ['b']], [['a', 'b']]]
    ]

    cases.forEach(([data, expected]) => {
      deepStrictEqual(
        toDescartesArray(data),
        expected,
        `数据 (${JSON.stringify(data)}) 生成失败`
      )
    })
  })

  it('test toDescartesArray(customizer)', function() {
    const values = [['a', 'b'], ['c']]

    deepStrictEqual(
      toDescartesArray(values, value => value.concat('custom')),
      [
        ['a', 'c', 'custom'],
        ['b', 'c', 'custom']
      ],
      '自定义内容失败'
    )
  })
})
