import $ from '@/util/dom-core'
import VNode from '@/node/vnode'
import { MergeList } from '@/helper/vnode-helper'

// 根据dom格式化节点 vnodes
export function selectionFormat (target) {
  const childNode = [...target.childNodes]
  const selection = window.getSelection? window.getSelection() : document.getSelection()
  const range = selection.getRangeAt(0)
  let startNodeIndex, endNodeIndex
  let vnodes_l = [],
      vnodes_r = [],
      vnodes_m = []
  // 遍历子节点
  for (let i = 0; i < childNode.length; i++) {
    let node = childNode[i]

    // 虚拟节点创建
    let _vnode = VNode.create(node)
    
    // 由于range.startContainer都为text节点，则需要处理节点类型
    if (node.nodeType === 1) {
      node = node.childNodes[0]
    }
    if (node === range.startContainer) startNodeIndex = i
    if (node === range.endContainer) endNodeIndex = i

    // 如果还未找到selection开始节点，则该节点未左侧节点
    if (startNodeIndex === undefined) {
      vnodes_l.push(_vnode)
    }
    // 如果当前节点为开始节点，则切片，找出属于左侧部分
    if (startNodeIndex === i) {
      vnodes_l.push(_vnode.slice(0, range.startOffset))
    }
    // 如果当前节点为开始节点，并且和结束节点一样
    if (startNodeIndex === i && endNodeIndex === i) {
      vnodes_m.push(_vnode.slice(range.startOffset, range.endOffset))
    }
    if (startNodeIndex === i && endNodeIndex === undefined) {
      vnodes_m.push(_vnode.slice(range.startOffset))
    }
    if (startNodeIndex < i && endNodeIndex === undefined) {
      vnodes_m.push(_vnode)
    }
    if (startNodeIndex < i && endNodeIndex === i) {
      vnodes_m.push(_vnode.slice(0, range.endOffset))
    }
    // 如果是结束节点
    if (endNodeIndex === i) {
      vnodes_r.push(_vnode.slice(range.endOffset))
    }
    if (endNodeIndex !== undefined && i > endNodeIndex) {
      vnodes_r.push(_vnode)
    }
  }
  return {
    vnodes_l: MergeList(vnodes_l),
    vnodes_m: MergeList(vnodes_m),
    vnodes_r: MergeList(vnodes_r)
  }
}
