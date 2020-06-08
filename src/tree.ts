/** @module tree 树型数据 */

import { isNil, isFunction, omit, forEach } from './utils'

export type IDKey = string | number

export type TreeData = Record<string | symbol | number, unknown>

export interface Node extends TreeData {
  id: IDKey
  parentId: IDKey
  children?: Node[]
}

export interface Tree {
  [index: number]: Node
}

export interface TreeOptions {
  idKey: IDKey
  parentKey: IDKey
  rootValue:
    | IDKey
    | ((
        parentNodesList: Record<IDKey, Node[]>,
        nodesList: Record<IDKey, Node>
      ) => Tree)
  converter(node: Node): Node | boolean
}

/**
 * 行转树型数据
 *
 * @public
 * @throws 非数组就报异常
 *
 * @param rows    行数据
 * @param options   可选配置
 *
 * @returns 树型数据
 *
 * @example
 *
 *  rowToTree([
 *    {id: 0, parentId: null, name: 'level 1'},
 *    {id: 1, parentId: 0, name: 'level 1-1'},
 *    {id: 2, parentId: 0, name: 'level 1-2'}
 *  ])
 */
export function toTree(
  data: Record<string, any>[],
  options: Partial<TreeOptions> = {}
) {
  if (Array.isArray(data) === false) {
    throw new TypeError(
      `Argument 'data' has incorrect type (except array, got ${typeof data})`
    )
  }

  if (data.length === 0) return []

  const idKey = options?.idKey || 'id'
  const parentKey = options?.parentKey || 'parentId'
  const converter = options?.converter || ((node: Node) => node)
  const rootValue = options?.rootValue

  function createNode(
    parentId: IDKey,
    id: IDKey,
    originData: Record<string, any>
  ): Node {
    return Object.assign({ id, parentId }, originData)
  }

  const nodesMap: Record<string | number, Node> = {}
  const parentNodes: Record<string | number, Node[]> = {}

  forEach(data, item => {
    const id = item[idKey]

    if (isNil(id)) {
      throw new TypeError(
        `Node 'id' is required (except string or number, got ${typeof id})`
      )
    }

    // 获取父级 id
    const parentId = item[parentKey] ?? '__ROOT__'

    // 获取原始数据
    const node = converter(createNode(id, parentId, item))

    // 允许外部过滤节点
    if (typeof node === 'boolean') return node

    // 保存节点到列表
    nodesMap[id] = node

    // 获取节点列表
    const nodeList = parentNodes[parentId]
    if (nodeList) {
      if (!nodeList.some(n => n.id === id)) {
        nodeList.push(node)
      }
    } else {
      parentNodes[parentId] = [node]
    }

    // 获取子级
    const children = parentNodes[id]
    if (children) {
      node.children = children
    }

    // 挂载节点
    const parentNode = nodesMap[parentId]
    if (parentNode) {
      const nodeList = parentNode.children || []
      if (nodeList.length === 0) {
        parentNode.children = [node]
      } else if (nodeList.some(n => n.id === id)) {
        // pass
      } else {
        nodeList.push(node)
      }
    }
  })

  const exportsNodes = (data: Tree) => (Array.isArray(data) ? data : [])

  if (typeof rootValue === 'function') {
    return exportsNodes(rootValue(parentNodes, nodesMap))
  } else {
    return exportsNodes(parentNodes[rootValue ?? '__ROOT__'])
  }
}

/** 树形数据转行数据的自定义转换函数 */
export type ToRowsCustomizer<T extends TreeData, R = T> = (
  ...args: EachTreeCallbackArguments<T>
) => R

/**
 * 树形数据转行数据
 *
 * @param data          树形数据
 * @param childrenKey   子节点的 key，默认 children
 * @param customizer    自定义转换函数
 *
 * @returns             转换后的列表数据
 */
export function treeToRows<T extends TreeData, R = T>(data: T[]): R[]
export function treeToRows<T extends TreeData, R = T>(
  data: T[],
  childrenKey: string
): R[]
export function treeToRows<T extends TreeData, R = T>(
  data: T[],
  customizer: ToRowsCustomizer<T, R>
): R[]
export function treeToRows<T extends TreeData, R = T>(
  data: T[],
  childrenKey: string,
  customizer: ToRowsCustomizer<T, R>
): R[]
export function treeToRows<T extends TreeData, R = T>(
  data: T[],
  ...args:
    | [string]
    | [string, ToRowsCustomizer<T, R>]
    | [ToRowsCustomizer<T, R>]
): R[] {
  let childrenKey: string
  let customizer: ToRowsCustomizer<T, R>

  if (isFunction(args[0])) {
    customizer = args[0]
    childrenKey = 'children'
  } else {
    childrenKey = args[0] ?? 'children'
    // @ts-ignore
    customizer = args[1] ?? (v => v)
  }

  const results: R[] = []

  eachTree(data, childrenKey, (value, index, nodes, node) => {
    results.push(customizer(value, index, nodes, node))
  })

  return results
}

/** 递归回调参数列表 */
export type EachTreeCallbackArguments<T> = [TreeData, number, T[], T]

/** 递归回调 */
export type EachTreeCallback<T> = (
  ...args: EachTreeCallbackArguments<T>
) => boolean | void

/**
 * 遍历树形数据节点
 *
 * @param data          树形数据
 * @param childrenKey   子节点的 key
 * @param callback      回调函数
 */
export function eachTree<T extends TreeData, K extends string>(
  data: T[],
  childrenKey: K,
  callback: EachTreeCallback<T>
): void {
  function recursive(nodes: T[]) {
    forEach(nodes, (node: T, index: number) => {
      const children = node[childrenKey] || []
      const data = omit(node, childrenKey) as TreeData
      const flag = callback(data, index, nodes, node)

      if (typeof flag === 'boolean') {
        return flag
      }

      return recursive(children as T[])
    })
  }

  recursive(data)
}

export default {
  each: eachTree,
  toTree,
  toRows: treeToRows
}
