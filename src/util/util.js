// 获取随机字符串
export function getRandomStr(len = 10) {
  const charsPattern = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'
  const maxPos = charsPattern.length
  let str = ''
  for (let i = 0; i < len; i++) {
    str += charsPattern.charAt(Math.floor(Math.random() * maxPos))
  }
　return str
}

// 判断对象是否相等
export function deepEqual(x, y) {
  if (x === y) {
    return true
  }
  if (typeof x === 'object' && typeof y === 'object' && x !== null && y !== null) {
    // 如果属性数量不相同
    if (Object.keys(x).length !== Object.keys(y).length) {
      return false
    }
    for (let prop in x) {
      if (!deepEqual(x[prop], y[prop])) {
        return false
      }
    }
  } else {
    return false
  }
  return true
}