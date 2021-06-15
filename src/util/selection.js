export function getCursorPosition() {
  let start, end
  const selection = window.getSelection? window.getSelection() : document.getSelection()
  if (!selection.rangeCount) return false
  for (let i = 0; i < selection.rangeCount; i++) {
    const range = selection.getRangeAt(0)
    start = range.startOffset
    end = range.endOffset
  }
  return {start, end}
}