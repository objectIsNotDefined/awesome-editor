import VNode from '@/node/vnode'
import $ from '@/util/dom-core'
import {
  MergeList,
  VnodeListContentText
} from '@/helper/vnode-helper'

// 获取节点html
export function getNodeHtml ({}) {

}

// 根据节点内容更新
export function updateNodeContent ({vnodes_l, vnodes_m, vnodes_r}, $node) {
  const $input = $node.$el.find('.input-wrap')
  // 计算节点内容长度
  const l_txt = VnodeListContentText(vnodes_l)
  const m_txt = VnodeListContentText(vnodes_m)
  const r_txt = VnodeListContentText(vnodes_r)
  // 光标位置
  let startContainer = null,
      startOffset = 0,
      endContainer = null,
      endOffset = 0
  if ($node.$type === 'paragraph') {
    const VnodeList = MergeList([...vnodes_l, ...vnodes_m, ...vnodes_r])
    $input.empty()
    VnodeList.reduce((len, vnode) => {
      $input.append($(vnode.compile()))
      len += vnode.$content.length
      if (!startContainer && l_txt.length <= len) {
        startContainer = vnode.$ele.childNodes[0]
        startOffset = l_txt.length - len + vnode.$content.length
      }
      if (startContainer && !endContainer && (l_txt + m_txt).length <= len) {
        endContainer = vnode.$ele.childNodes[0]
        endOffset = l_txt.length + m_txt.length - len + vnode.$content.length
      }
      return len
    }, 0)
  }
  if ($node.$type === 'head') {
    const text = l_txt + m_txt + r_txt
    let headNode = new VNode({ type: 'text', content: text, attr: {} })
    $input.empty().append($(headNode.compile()))
    startContainer = endContainer = $input.nodeList[0].childNodes[0].childNodes[0]
    startOffset = l_txt.length
    endOffset = l_txt.length + m_txt.length
  }
  const range = new Range()
  range.setStart(startContainer, startOffset)
  range.setEnd(endContainer, endOffset)
  const selection = window.getSelection ? window.getSelection() : document.getSelection()
  selection.removeAllRanges()
  selection.addRange(range)
}