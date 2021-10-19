// 获取当前选区位置
export function getCursorPosition() {
  let start, end, startNode, endNode
  const selection = window.getSelection? window.getSelection() : document.getSelection()
  if (!selection.rangeCount) return false
  for (let i = 0; i < selection.rangeCount; i++) {
    const range = selection.getRangeAt(0)
    start = range.startOffset
    end = range.endOffset
    startNode = range.startContainer
    endNode = range.endContainer
  }
  return {start, end}
}