import VNode from './v-node'
import { selectionFormat, refreashSelection } from './selection-helper'
import { getCursorPosition } from './../util/selection'
import Node from './index'

// 删除 keydown
export function DeleteDownEvent (e, $node) {
  
  let inputInnerHTML = e.target.innerHTML
  // keydown - 如果当前数据为空，则删除该行
  if (e.target.innerHTML === '<span><br></span>') {
    e.preventDefault()
    $node.remove()
    return
  }
  // 光标在行首, 自动合并至上一行
  let rangeObj = getCursorPosition()
  let currentNodeIndex = $node.$editor.$content.$nodes.indexOf($node)
  if (rangeObj.start === 0 && rangeObj.end === 0 && currentNodeIndex !== 0) {
    e.preventDefault()
    let prevNode = $node.$editor.$content.$nodes[currentNodeIndex - 1]
    let prevVNode = [...prevNode.$el.find('.input-warp').nodeList[0].childNodes].map(el => VNode.create(el))
    let nextVNode = [...$node.$el.find('.input-warp').nodeList[0].childNodes].map(el => VNode.create(el))
    $node.remove()
    let vnodeConfig = {vnodes_l: VNode.formatVNodes(prevVNode), vnodes_m: [], vnodes_r: VNode.formatVNodes(nextVNode)}
    prevNode.refreashByVnodes(vnodeConfig)
    refreashSelection(vnodeConfig)
  }
}

// 删除 keyup
export function DeleteUpEvent (e, $node) {
  let inputInnerHTML = e.target.innerHTML
  // keyup - 删除后格式化dom
  if (inputInnerHTML.length === 0 || inputInnerHTML === '<br>') {
    e.target.innerHTML = '<span><br></span>'
    return
  }
}

// 回车换行
export function EnterEvent (e, $node) {
  e.preventDefault()
  if (!['head', 'paragraph'].includes($node.$type)) return
  let { vnodes_l, vnodes_m, vnodes_r } = selectionFormat(e.target)
  $node.refreashByVnodes({vnodes_l: [], vnodes_m: [], vnodes_r: vnodes_l})
  let newLineOptions = {
    type: 'paragraph',
    content: '',
    vnodes: [...vnodes_r]
  }
  let newLine = new Node(newLineOptions, $node.$editor)
  newLine.insertAfter($node)
  newLine.$el.find('.input-warp').focus(1)
}

// ctrl/cmd + b 加粗
export function BoldEvent (e, $node) {
  e.preventDefault()
  if ($node.$type !== 'paragraph') return
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
  if ($node.$type !== 'paragraph') return
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
  if ($node.$type !== 'paragraph') return
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
  if ($node.$type !== 'paragraph') return
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

// 复制
export function CopyEvent (e, $node) {
  e.preventDefault()
  const clipboardData = event.clipboardData || window.clipboardData 
  let { vnodes_m } = selectionFormat($node.$el.find('.input-warp').nodeList[0])
  const copyData = vnodes_m.map(node => {
    const item = {
      type: node.type,
      text: node.content
    }
    node.type === 2 && (item.content_id = node.content_id)
    node.type === 2 && (item.content_type = node.content_type)
    return item
  })
  console.log(copyData)
  clipboardData.setData('text/plain', JSON.stringify(copyData))
}

// 粘贴
export function PasteEvent (e, $node) {

}
