import VNode from './v-node'
import { refreashSelection } from './selection-helper'
import $ from './../util/dom-core'

export function refreashNodeContent (vnodeInfo, $node) {
  const $input = $node.$el.find('.input-warp')
  $input.empty()
  let nodes_l = VNode.formatVNodes(vnodeInfo.selection_left)
  let nodes_m = VNode.formatVNodes(vnodeInfo.selection_middle)
  let nodes_r = VNode.formatVNodes(vnodeInfo.selection_right)
  let selectionObj = {
    startNode: null,
    endNode: null
  }
  nodes_l.forEach(node => {
    $input.append($(node.compile()))
  })
  nodes_m.forEach((node, index) => {
    let ele = node.compile()
    $input.append($(ele))
    if (index === 0) {
      selectionObj.startNode = ele
    }
    if (index + 1 === nodes_m.length) {
      selectionObj.endNode = ele
    }
  })
  nodes_r.forEach(node => {
    $input.append($(node.compile()))
  })
  refreashSelection(selectionObj)
}