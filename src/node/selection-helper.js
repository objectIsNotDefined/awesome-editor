import VNode from './v-node'
import $ from './../util/dom-core'

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
    vnodes_l: VNode.formatVNodes(vnodes_l),
    vnodes_m: VNode.formatVNodes(vnodes_m),
    vnodes_r: VNode.formatVNodes(vnodes_r)
  }
}

// 设置选区
export function refreashSelection ({vnodes_l, vnodes_m, vnodes_r}) {
  let startContainer = null,
      startOffset = 0,
      endContainer = null,
      endOffset = 0
  // 光标没有选中任何区域
  if (vnodes_m.length === 0) {
    // 光标在行首
    if (vnodes_l.length === 0 && vnodes_r.length) {
      startContainer = vnodes_r[0].$ele.childNodes[0]
      endContainer = startContainer
      startOffset = 0
      endOffset = 0
    }
    // 光标在行尾
    if (vnodes_l.length && vnodes_r.length === 0) {
      let targetEle = vnodes_l.slice(-1)[0].$ele
      startContainer = [...targetEle.childNodes].slice(-1)[0]
      endContainer = startContainer
      startOffset = startContainer.textContent.length
      endOffset = startOffset
    }
    // 光标在中间,暂时将光标放在右侧行首
    if (vnodes_l.length && vnodes_r.length) {
      startContainer = vnodes_r[0].$ele.childNodes[0]
      endContainer = startContainer
      startOffset = 0
      endOffset = 0
    }
  } else {
    startContainer = vnodes_m[0].$ele.childNodes[0]
    startOffset = 0
    let lastVNodeEle = vnodes_m.slice(-1)[0].$ele
    endContainer = [...lastVNodeEle.childNodes].slice(-1)[0]
    endOffset = endContainer.textContent.length
  }

  // 如果没有找到锚点，则暂时不处理
  if (!startContainer || !endContainer) return

  const range = new Range()
  range.setStart(startContainer, startOffset)
  range.setEnd(endContainer, endOffset)
  const selection = window.getSelection ? window.getSelection() : document.getSelection()
  selection.removeAllRanges()
  selection.addRange(range)
}
