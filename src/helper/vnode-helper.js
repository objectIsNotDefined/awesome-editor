import VNode from '@/node/vnode'

// VNodeList格式化，合并相邻相似节点
export function MergeList (list) {
  let newList = []
  for (let i = 0, len = list.length; i < len; i++) {
    let node = list[i]
    let lastNode = newList[newList.length - 1]
    if (node.$content.length === 0) continue
    if (lastNode && node.isSimilarTo(lastNode)) {
      lastNode.updateContent(`${lastNode.$content}${node.$content}`)
    } else {
      newList.push(node.clone())
    }
  }
  return newList
}

// 计算节点内容长度
export function VnodeListContentText (list) {
  return list.reduce((txt, vnode) => {
    txt += vnode.$content
    return txt
  }, '')
}

// 获取vnodes属性切换状态
export function NextAttributeStatus (vnodes, key) {
  return vnodes.filter(vnode => vnode.$type === 'text').every(vnode => vnode.$attr[key]) ? 0 : 1
}