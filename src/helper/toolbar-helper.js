// 获取弹窗位置
export function getToolbarPosition ({ top, left, right, bottom }, { width, height }) {
  let pos_x = Math.max((left + right) / 2, width / 2)
  let pos_y = bottom + 10
  if (bottom + 8 + height > window.innerHeight) {
    pos_y = top - 8 - height
  }
  return { pos_x, pos_y }
}