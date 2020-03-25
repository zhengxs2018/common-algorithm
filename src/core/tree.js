/**
 * 树型数据
 *
 * @module tree
 *
 * @author zhengxs<zhengxs2018@foxmail.com>
 * @license MIT
 */
import { assert, isNonObject, isNullOrUndefined, forEach } from '../lib/utils'

/**
 * 创建节点
 *
 * @private
 */
function createNode(parentId, nodeId, originData) {
  const nodeData = {
    id: nodeId,
    parentId: parentId,
    children: []
  }
  return Object.assign(nodeData, originData)
}

/**
 * 获取导出的节点
 *
 * @private
 */
function getExportsNodes(data) {
  return Array.isArray(data) ? data : []
}

/**
 * 行数据转树型数据
 *
 * @public
 * @throws {TypeError} rows 非数组就报异常
 *
 * @param {Object[]} rows    行数据
 * @param {Object}   options   可选配置
 * @param {String}   [options.idKey="id"]                     主要字段
 * @param {String}   [options.parentKey="parent"]             父级的字段
 * @param {Function|String} [options.rootValue="__ROOT__"]  顶级值
 * @param {Function} options.converter                    节点转换器
 *
 * @returns {Object[]}  树型数据
 *
 * @example
 *
 *  const rows = [
 *    {id: 0, parent: null, name: 'level 1'},
 *    {id: 1, parent: 0, name: 'level 1-1'},
 *    {id: 2, parent: 0, name: 'level 1-2'}
 *  ]
 *
 *  rowToTree(rows)
 * // [{"children":[{"id":1,"parent":0,"name":"level 1-1"},{"id":2,"parent":0,"name":"level 1-2"}],"id":0,"parent":null,"name":"level 1"}]
 */

export function toTree(rows, options) {
  assert(
    Array.isArray(rows),
    new TypeError(
      `Argument 'rows' has incorrect type (except array, got ${typeof rows})`
    )
  )

  if (rows.length === 0) return []

  const nodeList = {}
  const parentNodes = {}

  const {
    rootValue = '__ROOT__',
    idKey = 'id',
    parentKey = 'parent',
    converter = n => n
  } = options || {}

  rows.forEach(row => {
    // 获取原始数据
    const originData = converter(row)

    // 允许外部过滤数据
    if (isNonObject(originData)) return

    // 获取主键
    const id = row[idKey]

    assert(
      typeof id === 'string' || typeof id === 'number',
      new TypeError(
        `data 'id' has incorrect type (except string or number, got ${typeof id})`
      )
    )

    const parentId = isNullOrUndefined(row[parentKey])
      ? '__ROOT__'
      : row[parentKey]

    // 构建节点
    const node = createNode(parentId, id, originData)

    // 保存节点到列表
    nodeList[id] = node

    // 防止父级节点不存在
    // 自动挂载数据到列表
    const siblings = parentNodes[parentId]
    if (siblings) {
      if (!siblings.some(r => r.id === id)) {
        siblings.push(node)
      }
    } else {
      parentNodes[parentId] = [node]
    }

    // 查找子节点
    const children = parentNodes[id]
    if (children) {
      node.children = children
    }

    // 查找父级节点
    const parentNode = nodeList[parentId]
    if (parentNode) {
      const siblings = parentNode.children
      if (siblings.length === 0) {
        siblings.push(node)
      } else if (!siblings.some(r => r.id === id)) {
        // 去重
        siblings.push(node)
      }
    }
  })

  if (typeof rootValue === 'function') {
    return getExportsNodes(rootValue(parentNodes), nodeList)
  } else {
    return getExportsNodes(parentNodes[rootValue], nodeList)
  }
}

/**
 * 树转行
 *
 * @public
 *
 * @param {Object[]} data       树形数据
 * @param {Function} [callback= (current) => current]   回调函数，参数位：current, index, parent, parents, originParent
 *
 * @returns {Object[]}  行数据
 */
export function toArray(data, callback = v => v) {
  const recursive = (nodes, parent, parents, originParent) => {
    return nodes.reduce((previousValue, node, index) => {
      const { children = [], ...current } = node

      // 处理当前数据
      const value = callback(current, index, parent, parents, originParent)

      // 跳过当前和子级
      if (value === false) {
        return previousValue
      }

      return previousValue.concat(
        value,
        recursive(children, value, parents.concat(node), node)
      )
    }, [])
  }

  return recursive(data, null, [], null)
}

/**
 * 循环树形数据
 *
 * @public
 *
 * @param {Object[]} data       树形数据
 * @param {Function} callback   回调函数，参数为：current, index, parent, parents, originParent
 *
 * @returns {void}
 */
export function each(data, callback) {
  function recursive(nodes, parent, parents, originParent) {
    forEach(nodes, (node, i) => {
      const { children = [], ...current } = node

      /* istanbul ignore next */
      const result = callback(current, i, parent, parents, originParent)

      if (typeof result === 'boolean') return result
      if (children.length > 0) {
        recursive(children, current, parents.concat(node), node)
      }
    })
  }

  recursive(data, null, [], null)
}
