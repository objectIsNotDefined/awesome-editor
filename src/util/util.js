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