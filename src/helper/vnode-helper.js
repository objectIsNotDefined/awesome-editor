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
      newList.push(node)
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