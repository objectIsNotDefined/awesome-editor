import Node from '@/node'
import VNode from '@/node/vnode'

import {
  MergeList
} from '@/helper/vnode-helper'

import {
  getCursorPosition
} from '@/util/selection'

import {
  selectionFormat
} from '@/helper/selection-helper'

import {
  runCmd
} from '@/helper/node-helper'

import HyperlinkToolbar from '@/toolbar/hyperlink-toolbar'

// 删除 keydown
export function DeleteDownEvent (e, $node) {
  let inputInnerHTML = e.target.innerHTML
  // keydown - 如果当前数据为空，则删除该行
  if (e.target.innerHTML === '<span><br></span>') {
    e.preventDefault()
    $node.remove()
    console.log('remove')
    return
  }
  // 光标在行首, 自动合并至上一行
  let rangeObj = getCursorPosition()
  let currentNodeIndex = $node.$editor.$nodes.indexOf($node)
  if (rangeObj.start === 0 && rangeObj.end === 0 && currentNodeIndex !== 0) {
    e.preventDefault()
    let prevNode = $node.$editor.$nodes[currentNodeIndex - 1]
    let prevVNode = [...prevNode.$el.find('.input-wrap').nodeList[0].childNodes].map(el => VNode.create(el))
    let nextVNode = [...$node.$el.find('.input-wrap').nodeList[0].childNodes].map(el => VNode.create(el))
    $node.remove()
    let vnodeConfig = {vnodes_l: MergeList(prevVNode), vnodes_m: [], vnodes_r: MergeList(nextVNode)}
    prevNode.update(vnodeConfig)
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
  $node.update({vnodes_l: [], vnodes_m: [], vnodes_r: vnodes_l})
  let newLineOptions = {
    type: 'paragraph',
    content: '',
    vnodes: [...vnodes_r]
  }
  let newLine = new Node(newLineOptions, $node.$editor)
  newLine.insertAfter($node)
  newLine.focus(1)
}

// ctrl/cmd + b 加粗
export function BoldEvent (e, $node) {
  e.preventDefault()
  if ($node.$type !== 'paragraph') return
  let { vnodes_l, vnodes_m, vnodes_r } = selectionFormat(e.target)
  runCmd({ vnodes_l, vnodes_m, vnodes_r }, $node, 'bold')
}

// ctrl/cmd + i 斜体
export function ItalicEvent (e, $node) {
  e.preventDefault()
  if ($node.$type !== 'paragraph') return
  let { vnodes_l, vnodes_m, vnodes_r } = selectionFormat(e.target)
  runCmd({ vnodes_l, vnodes_m, vnodes_r }, $node, 'italic')
}

// ctrl/cmd + u 下划线
export function UnderlineEvent (e, $node) {
  e.preventDefault()
  if ($node.$type !== 'paragraph') return
  let { vnodes_l, vnodes_m, vnodes_r } = selectionFormat(e.target)
  runCmd({ vnodes_l, vnodes_m, vnodes_r }, $node, 'underline')
}

// ctrl/cmd + h 中划线
export function LineThroughEvent (e, $node) {
  e.preventDefault()
  if ($node.$type !== 'paragraph') return
  let { vnodes_l, vnodes_m, vnodes_r } = selectionFormat(e.target)
  runCmd({ vnodes_l, vnodes_m, vnodes_r }, $node, 'lineThrough')
}

// 复制
export function CopyEvent (e, $node) {
  e.preventDefault()
  const clipboardData = event.clipboardData || window.clipboardData
  let { vnodes_m } = selectionFormat($node.$el.find('.input-wrap').nodeList[0])
  const copyData = vnodes_m.map(node => {
    const item = {
      type: node.$type,
      content: node.$content,
      attr: { ...node.$attr }
    }
    return item
  })
  clipboardData.setData('text/plain', JSON.stringify(copyData))
}

// 粘贴
export function PasteEvent (e, $node) {
  e.preventDefault()
  const clipboardData = event.clipboardData || window.clipboardData
  let text = clipboardData.getData('text/plain')
  // 尝试当作json处理
  try {
    let vnodeArr = JSON.parse(text)
    vnodeArr = vnodeArr.map(opt => VNode.create(opt))
    let { vnodes_l, vnodes_m, vnodes_r } = selectionFormat($node.$el.find('.input-wrap').nodeList[0])
    $node.update({
      vnodes_l: [...vnodes_l, ...vnodeArr],
      vnodes_m: [],
      vnodes_r
    })
  } catch (e) {
    let txtArr = text = text.split(/[\t\r\n\v]/m)
    txtArr = text.reduce((arr, txt) => {
      txt = txt.trim()
      if (txt) {
        arr.push(txt)
      }
      return arr
    }, [])
    let prevNode = $node
    txtArr.forEach((item, index) => {
      if (index === 0) {
        let curVNodes = [...$node.$el.find('.input-wrap').nodeList[0].childNodes].map(el => VNode.create(el))
        curVNodes.push(VNode.create({
          type: 'text',
          content: item,
          attr: {}
        }))
        let vnodeConfig = {vnodes_l: MergeList(curVNodes), vnodes_m: [], vnodes_r: []}
        $node.update(vnodeConfig)
      } else {
        let newNode = new Node({
          type: 'paragraph',
          child: [
            { type: 'text', content: item, attr: {} }
          ]
        }, $node.$editor)
        newNode.insertAfter(prevNode)
        prevNode = newNode
      }
    })
  }
}

// 超链接
export function HyperlinkEvent (e, $node) {
  e.preventDefault()
  if ($node.$type !== 'paragraph') return
  let { vnodes_l, vnodes_m, vnodes_r } = selectionFormat(e.target)
  HyperlinkToolbar.show({ vnodes_l, vnodes_m, vnodes_r }, $node)
}
