import VNode from './v-node'
import $ from './../util/dom-core'

export function refreashNodeContent ({vnodes_l, vnodes_m, vnodes_r}, $node) {
  const $input = $node.$el.find('.input-warp')
  $input.empty()
  vnodes_l.forEach(node => {
    $input.append($(node.compile()))
  })
  vnodes_m.forEach((node, index) => {
    $input.append($(node.compile()))
  })
  vnodes_r.forEach(node => {
    $input.append($(node.compile()))
  })
  if (!vnodes_l.length && !vnodes_m.length && !vnodes_r.length) {
    let emptyVNode = new VNode({type: 21, content: '', attr: {}})
    $input.append($(emptyVNode.compile()))
  }
}