import VNode from './v-node'
import $ from './../util/dom-core'

export function selectionFormat (target) {
  const childNode = [...target.childNodes]
  const selection = window.getSelection? window.getSelection() : document.getSelection()
  const range = selection.getRangeAt(0)
  let startNodeIndex, endNodeIndex
  let selection_left = [],
      selection_right = [],
      selection_middle = []
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
      selection_left.push(_vnode)
    }
    // 如果当前节点为开始节点，则切片，找出属于左侧部分
    if (startNodeIndex === i) {
      selection_left.push(_vnode.slice(0, range.startOffset))
    }
    // 如果当前节点为开始节点，并且和结束节点一样
    if (startNodeIndex === i && endNodeIndex === i) {
      selection_middle.push(_vnode.slice(range.startOffset, range.endOffset))
    }
    if (startNodeIndex === i && endNodeIndex === undefined) {
      selection_middle.push(_vnode.slice(range.startOffset))
    }
    if (startNodeIndex < i && endNodeIndex === undefined) {
      selection_middle.push(_vnode)
    }
    if (startNodeIndex < i && endNodeIndex === i) {
      selection_middle.push(_vnode.slice(0, range.endOffset))
    }
    // 如果是结束节点
    if (endNodeIndex === i) {
      selection_right.push(_vnode.slice(range.endOffset))
    }
    if (endNodeIndex !== undefined && i > endNodeIndex) {
      selection_right.push(_vnode)
    }
  }
  return { selection_left, selection_middle, selection_right }
}

// 处理空节点/合并相邻节点
const formatNodes = (list) => {
  let _list = []
  for (let i = 0, len = list.length; i < len; i++) {
    let node = list[i]
    let prevNode = _list[_list.length - 1]
    if (node.$text.length === 0) continue
    // 如果已经有值
    if (prevNode && node.isSimilarTo(prevNode)) {
      prevNode.updateContent(prevNode.$text + node.$text)
    } else {
      _list.push(node)
    }
  }
  return _list
}

// 设置选区
const refreashSelection = (param) => {
  const range = new Range()
  const startNode = param.startNode.childNodes[0]
  const endNode = param.endNode.childNodes[param.endNode.childNodes.length - 1]
  range.setStart(startNode, 0)
  range.setEnd(endNode, endNode.textContent.length)
  const selection = window.getSelection ? window.getSelection() : document.getSelection()
  selection.removeAllRanges()
  selection.addRange(range)
}

// 根据vnodes刷新该行dom
export function generateChildNodes(nodeInfo, $el) {
  const $input = $el.find('.input-warp')
  $input.empty()
  let nodes_l = formatNodes(nodeInfo.selection_left)
  let nodes_m = formatNodes(nodeInfo.selection_middle)
  let nodes_r = formatNodes(nodeInfo.selection_right)
  let selectionObj = {
    startNode: null,
    endNode: null
  }
  nodes_l.forEach(node => {
    $input.append($(node.compile()))
  })
  nodes_m.forEach((node, index) => {
    let ele = node.compile()
    $input.append($(ele))
    if (index === 0) {
      selectionObj.startNode = ele
    }
    if (index + 1 === nodes_m.length) {
      selectionObj.endNode = ele
    }
  })
  nodes_r.forEach(node => {
    $input.append($(node.compile()))
  })
  refreashSelection(selectionObj)
}





