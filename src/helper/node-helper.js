import VNode from '@/node/vnode'
import $ from '@/util/dom-core'
import {
  MergeList,
  VnodeListContentText,
  NextAttributeStatus
} from '@/helper/vnode-helper'
import HyperlinkToolbar from '@/toolbar/hyperlink-toolbar'

// 执行节点切换命令
export function runCmd({vnodes_l, vnodes_m, vnodes_r}, $node, cmd) {
  if (['bold', 'italic', 'underline', 'lineThrough'].includes(cmd) && $node.$type === 'paragraph') {
    if (vnodes_m.length) {
      let nextStatus = NextAttributeStatus(vnodes_m, cmd)
      vnodes_m.forEach(vnode => vnode.updateAttr(cmd, nextStatus))
    } else {
      let nextStatus = NextAttributeStatus(vnodes_l, cmd) && NextAttributeStatus(vnodes_r, cmd) ? 1 : 0
      vnodes_l.forEach(vnode => vnode.updateAttr(cmd, nextStatus))
      vnodes_r.forEach(vnode => vnode.updateAttr(cmd, nextStatus))
    }
    updateNodeContent({vnodes_l, vnodes_m, vnodes_r}, $node)
  }
  if (['hyperlink'].includes(cmd) && $node.$type === 'paragraph') {
    HyperlinkToolbar.show({vnodes_l, vnodes_m, vnodes_r}, $node)
  }
  if (['head1', 'head2', 'head3', 'paragraph'].includes(cmd)) {
    if (cmd === $node.$type) return
    let newNodeInfo = {
      vnodes: [new VNode({
        type: 'text',
        content: [...vnodes_l, ...vnodes_m, ...vnodes_r].reduce((txt, item) => {
          return txt += item.$content
        }, ''),
        attr: {}
      })]
    }
    if (['head1', 'head2', 'head3'].includes(cmd)) {
      newNodeInfo.type = 'head'
      const levelMap = { head1: 1, head2: 2, head3: 3 }
      newNodeInfo.attr = { level: levelMap[cmd] }
    }
    if (cmd === 'paragraph') {
      newNodeInfo.type = 'paragraph'
    }
    $node.updateNode(newNodeInfo)
  }
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
    let VnodeList = MergeList([...vnodes_l, ...vnodes_m, ...vnodes_r])
    if (VnodeList.length === 0) {
      VnodeList = [new VNode({ type: 'text', content: '', attr: {} })]
    }
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