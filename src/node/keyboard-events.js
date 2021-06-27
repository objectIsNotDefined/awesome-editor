import VNode from './v-node'
import { selectionFormat, refreashSelection } from './selection-helper'
import Node from './index'

// 删除
export function DeleteEvent (e, $node) {
  let inputInnerHTML = e.target.innerHTML
  if (inputInnerHTML.length === 0 || inputInnerHTML === '<br>') {
    e.target.innerHTML = '<span><br></span>'
  }
}

// 回车换行
export function EnterEvent (e, $node) {
  e.preventDefault()
  if ($node.$type !== 2) return
  let { vnodes_l, vnodes_m, vnodes_r } = selectionFormat(e.target)
  $node.refreashByVnodes({vnodes_l: [], vnodes_m: [], vnodes_r: vnodes_l})
  let newLineOptions = {
    type: $node.$type,
    content: '',
    vnodes: [...vnodes_r]
  }
  let newLine = new Node(newLineOptions, $node.$editor)
  newLine.insertAfter($node)
}

// ctrl/cmd + b 加粗
export function BoldEvent (e, $node) {
  e.preventDefault()
  if ($node.$type !== 2) return
  let { vnodes_l, vnodes_m, vnodes_r } = selectionFormat(e.target)
  // 如果没有选中区，则直接对整行进行操作
  if (vnodes_m.length === 0) {
    let nextStatus = vnodes_l.every(vnode => vnode.$attr.bold) && vnodes_r.every(vnode => vnode.$attr.bold)? 0 : 1
    vnodes_l.forEach(vnode => vnode.update('bold', nextStatus))
    vnodes_r.forEach(vnode => vnode.update('bold', nextStatus))
  } else {
    let nextStatus = vnodes_m.every(vnode => vnode.$attr.bold)? 0 : 1
    vnodes_m.forEach(vnode => vnode.update('bold', nextStatus))
  }
  $node.refreashByVnodes({ vnodes_l, vnodes_m, vnodes_r })
  refreashSelection({vnodes_l, vnodes_m, vnodes_r})
}

// ctrl/cmd + i 斜体
export function ItalicEvent (e, $node) {
  e.preventDefault()
  if ($node.$type !== 2) return
  let { vnodes_l, vnodes_m, vnodes_r } = selectionFormat(e.target)
  // 如果没有选中区，则直接对整行进行操作
  if (vnodes_m.length === 0) {
    let nextStatus = vnodes_l.every(vnode => vnode.$attr.italic) && vnodes_r.every(vnode => vnode.$attr.italic)? 0 : 1
    vnodes_l.forEach(vnode => vnode.update('italic', nextStatus))
    vnodes_r.forEach(vnode => vnode.update('italic', nextStatus))
  } else {
    let nextStatus = vnodes_m.every(vnode => vnode.$attr.italic)? 0 : 1
    vnodes_m.forEach(vnode => vnode.update('italic', nextStatus))
  }
  $node.refreashByVnodes({ vnodes_l, vnodes_m, vnodes_r })
  refreashSelection({vnodes_l, vnodes_m, vnodes_r})
}

// ctrl/cmd + u 下划线
export function UnderlineEvent (e, $node) {
  e.preventDefault()
  if ($node.$type !== 2) return
  let { vnodes_l, vnodes_m, vnodes_r } = selectionFormat(e.target)
  // 如果没有选中区，则直接对整行进行操作
  if (vnodes_m.length === 0) {
    let nextStatus = vnodes_l.every(vnode => vnode.$attr.underline) && vnodes_r.every(vnode => vnode.$attr.underline)? 0 : 1
    vnodes_l.forEach(vnode => vnode.update('underline', nextStatus))
    vnodes_r.forEach(vnode => vnode.update('underline', nextStatus))
  } else {
    let nextStatus = vnodes_m.every(vnode => vnode.$attr.underline)? 0 : 1
    vnodes_m.forEach(vnode => vnode.update('underline', nextStatus))
  }
  $node.refreashByVnodes({ vnodes_l, vnodes_m, vnodes_r })
  refreashSelection({vnodes_l, vnodes_m, vnodes_r})
}

// ctrl/cmd + h 中划线
export function LineThroughEvent (e, $node) {
  e.preventDefault()
  if ($node.$type !== 2) return
  let { vnodes_l, vnodes_m, vnodes_r } = selectionFormat(e.target)
  // 如果没有选中区，则直接对整行进行操作
  if (vnodes_m.length === 0) {
    let nextStatus = vnodes_l.every(vnode => vnode.$attr.lineThrough) && vnodes_r.every(vnode => vnode.$attr.lineThrough)? 0 : 1
    vnodes_l.forEach(vnode => vnode.update('lineThrough', nextStatus))
    vnodes_r.forEach(vnode => vnode.update('lineThrough', nextStatus))
  } else {
    let nextStatus = vnodes_m.every(vnode => vnode.$attr.lineThrough)? 0 : 1
    vnodes_m.forEach(vnode => vnode.update('lineThrough', nextStatus))
  }
  $node.refreashByVnodes({ vnodes_l, vnodes_m, vnodes_r })
  refreashSelection({vnodes_l, vnodes_m, vnodes_r})
}
