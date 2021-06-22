import VNode from './v-node'
import { selectionFormat } from './selection-helper'

// 回车换行
export function EnterEvent(e, $node) {
  e.preventDefault()
  const childNode = [...e.target.childNodes]
  const selection = window.getSelection? window.getSelection() : document.getSelection()
  const range = selection.getRangeAt(0)
  // 遍历子节点
  for (let i = 0; i < childNode.length; i++) {
    let node = childNode[i]
    if (node === range.startContainer) {
      console.log('start_node')
    }
    if (node === range.endContainer) {
      console.log('end_node')
    }
    if (node !== range.startContainer && node !== range.endContainer) {
      console.log('111')
    }
  }
}

// ctrl/cmd + b 加粗
export function BoldEvent(e, $node) {
  e.preventDefault()
  let nodeInfo = selectionFormat(e.target)
  nodeInfo.selection_middle.forEach(_item => {
    _item.update('bold')
  })
  
  nodeInfo.selection_left.forEach(vnode => {
    html += vnode.html()
  })
  nodeInfo.selection_middle.forEach(vnode => {
    html += vnode.html()
  })
  nodeInfo.selection_right.forEach(vnode => {
    html += vnode.html()
  })
  $node.refreashContent(html)
}