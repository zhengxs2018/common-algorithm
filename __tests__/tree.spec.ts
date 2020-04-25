import { deepStrictEqual, ok } from 'power-assert'

import { toTree, treeToRows, eachTree } from '../src/tree'
import { hasOwn, omit } from '../src/utils'

const rows = [
  { id: 1, parentId: null, name: 'level 1' },
  { id: 2, parentId: 1, name: 'level 1-1' },
  { id: 3, parentId: 1, name: 'level 1-2' }
]

const tree = [
  {
    id: 1,
    parentId: null,
    name: 'level 1',
    children: [
      {
        id: 2,
        parentId: 1,
        name: 'level 1-1'
      },
      {
        id: 3,
        parentId: 1,
        name: 'level 1-2'
      }
    ]
  }
]

describe('test tree.js', function() {
  it('test toTree()', function() {
    deepStrictEqual(toTree(rows), tree, '行转树形数据失败')
  })

  it('test toTree(rootValue)', function() {
    const rows = [
      { id: 1, parentId: 'root', name: 'level 1' },
      { id: 2, parentId: 1, name: 'level 1-1' }
    ]

    const tree = [
      {
        id: 1,
        parentId: 'root',
        name: 'level 1',
        children: [
          {
            id: 2,
            parentId: 1,
            name: 'level 1-1'
          }
        ]
      }
    ]
    deepStrictEqual(
      toTree(rows, {
        rootValue(nodes) {
          return nodes['root']
        }
      }),
      tree,
      '行转树形数据失败'
    )
  })

  it('test treeToRows()', function() {
    deepStrictEqual(treeToRows(tree), rows, '树转行数据失败')
  })

  it('test treeToRows(childrenKey)', function() {
    const tree = [
      {
        label: '张三',
        value: 1,
        items: [
          {
            label: '李四',
            value: 2
          }
        ]
      }
    ]
    const rows = [
      { label: '张三', value: 1 },
      { label: '李四', value: 2 }
    ]
    deepStrictEqual(treeToRows(tree, 'items'), rows, '树转行数据失败')
  })

  it('test treeToRows(customizer)', function() {
    const tree = [
      {
        label: '张三',
        value: 1,
        children: [
          {
            label: '李四',
            value: 2
          }
        ]
      }
    ]
    const rows = [1, 2]
    deepStrictEqual(
      treeToRows(tree, v => v.value),
      rows,
      '树转行数据失败'
    )
  })

  it('test eachTree(false)', function() {
    let rootId = null

    eachTree(tree, 'children', value => {
      ok(!hasOwn(value, 'children'), '循环的值未排除 children 字段')
      rootId = value.id
      return false
    })

    deepStrictEqual(rootId, 1, 'eachTree 函数未中断循环')
  })

  it('test eachTree(true)', function() {
    const children: any[] = []

    eachTree(tree, 'children', value => {
      if (value.parentId !== null) return true
      children.push(value)
    })

    deepStrictEqual(
      children,
      [omit(tree[0], 'children')],
      'eachTree 函数未跳过某些判断'
    )
  })
})
