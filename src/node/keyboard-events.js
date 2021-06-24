import VNode from './v-node'
import { selectionFormat } from './selection-helper'

// 回车换行
export function EnterEvent (e, $node) {
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
export function BoldEvent (e, $node) {
  e.preventDefault()
  if ($node.$type !== 2) return
  let nodeInfo = selectionFormat(e.target)
  let nextStatus = nodeInfo.selection_middle.every(vnode => vnode.$attr.bold)? 0 : 1
  nodeInfo.selection_middle.forEach(vnode => {
    vnode.update('bold', nextStatus)
  })
  $node.refreashByVnodes(nodeInfo)
}

// 删除事件
export function DeleteEvent (e, $node) {
  // e.preventDefault()
  console.log($node.$el.find('.input-warp').html())
}
