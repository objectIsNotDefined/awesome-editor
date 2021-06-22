import $ from './../util/dom-core'
import NodeList from './../nodeList'

export default class AwesomeEditor {

  $el = null  // 编辑器挂载dom

  $nodeList = null // 节点列表

  constructor ({el, onChange, uploadImg}) {
    this.$el = $(el)
    this._init()
  }

  // 初始化编辑器
  _init() {
    this._initEditor()
    this._initNodeList()
    this.setContent()
  }

  // 初始化编辑器
  _initEditor() {
    this.$el.addClass('awesome-editor')
  }

  // 初始化节点容器
  _initNodeList() {
    this.$nodeList = new NodeList(this)
  }

  // 内容初始化
  setValue(data = []) {
    this.$nodeList.initNodeListContent(data)
  }

}