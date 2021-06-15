import VNode from './v-node'

const selectionFormat = (target) => {
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
  console.log('---------------')
  selection_left.forEach(item => {
    console.log(`%c${item.text}`, `font-weight: ${item.attr?.bold? 'bold': 'normal'}`)
  })
  console.log('---------------')
  selection_middle.forEach(item => {
    console.log(`%c${item.text}`, `font-weight: ${item.attr?.bold? 'bold': 'normal'}`)
  })
  console.log('---------------')
  selection_right.forEach(item => {
    console.log(`%c${item.text}`, `font-weight: ${item.attr?.bold? 'bold': 'normal'}`)
  })
  console.log('---------------')
  return { selection_left, selection_middle, selection_right }
}



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
  console.log(nodeInfo)
  let a = nodeInfo.selection_left[0].html()
  console.log(a)
  // console.log($node)
}