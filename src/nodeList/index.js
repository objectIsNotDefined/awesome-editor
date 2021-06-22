import $ from './../util/dom-core'
import Node from './node'

class NodeList {

  $editor = null

  $el = null

  // 节点列表
  $list = []

  constructor (editor) {
    this.$editor = editor
    this._init()
  }

  _init() {
    this._initNodeListWarp()
  }

  _initNodeListWarp() {
    let nodeList = $('<div class="node-list"></div>')
    this.$el = nodeList
    this.$editor.$el.append(nodeList)
  }

  initNodeListContent() {
    this.createNode()
  }

  createNode() {
    let $node = new Node({}, this.$editor)
    $node.insertAfter(false)
    $node.focus()
  }

}

export default NodeList