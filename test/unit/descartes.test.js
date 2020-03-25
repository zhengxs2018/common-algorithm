import { deepStrictEqual } from 'power-assert'

import { fromObject, fromArray } from '../../src/core/descartes'

describe('test descartes.js', function() {
  it('test fromObject()', function() {
    const data = { color: ['red', 'blue'], size: ['22#'] }

    deepStrictEqual(
      fromObject(data),
      [
        { color: 'red', size: '22#' },
        { color: 'blue', size: '22#' }
      ],
      '笛卡儿积数组生成失败'
    )

    deepStrictEqual(
      fromObject(data, { includes: ['color'] }),
      [{ color: 'red' }, { color: 'blue' }],
      '出现冗余字段或处理失败'
    )

    deepStrictEqual(
      fromObject(data, { excludes: ['size'] }),
      [{ color: 'red' }, { color: 'blue' }],
      '字段未成功排除'
    )
  })

  it('test fromArray()', function() {
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

    cases.forEach(([data, expected], i) => {
      deepStrictEqual(fromArray(data), expected, `数据 (${i}) 生成失败`)
    })
  })
})
