import { ok } from 'power-assert'
import isMatch from 'lodash/isMatch'
import { toTree, toArray, each } from '../../src/core/tree'

const rows = [
  { id: 1, parent: 0, name: 'level 1' },
  { id: 2, parent: 1, name: 'level 1-1' },
  { id: 3, parent: 1, name: 'level 1-2' }
]

const tree = [
  {
    id: 1,
    parent: 0,
    children: [
      {
        id: 2,
        parent: 1,
        children: [],
        name: 'level 1-1'
      },
      {
        id: 3,
        parent: 1,
        children: [],
        name: 'level 1-2'
      }
    ],
    name: 'level 1'
  }
]

describe('test tree.js', function() {
  it('test toTree()', function() {
    ok(isMatch(tree, toTree(rows)), '数据格式转换错误')
  })

  it('test toArray()', function() {
    ok(isMatch(rows, toArray(tree)), '数据格式转换错误')
  })

  it('test each()', function() {
    each(tree, (current, index, parents = []) => {
      if (parents.length === 0) {
        ok(isMatch(current, tree[index]), '数据格式转换错误')
      } else {
        ok(isMatch(current, parents[0].children[index]), '数据格式转换错误')
      }
    })
  })
})
