import { strictEqual } from 'power-assert'

import { rowToTree } from '../../src/core/tree'

describe('test tree.js', function() {
  it('test rowToTree()', function() {
    const tree = rowToTree([
      { id: 0, parent: null, name: 'level 1' },
      { id: 1, parent: 0, name: 'level 1-1' },
      { id: 2, parent: 0, name: 'level 1-2' }
    ])

    strictEqual(tree[0].children[0].name, 'level 1-1', '数据格式转换错误')
  })
})
