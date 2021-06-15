import $ from './../util/dom-core'
import NodeList from './../nodeList'

export default class AwesomeEditor {

  // 当前编辑器dom
  $el = null

  // 节点列表
  $nodeList = null

  // change事件回调
  _onChange = null

  constructor ({el, onChange, uploadImg}) {
    this.$el = $(el)
    this._onChange = onChange
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
  setContent(list = []) {
    this.$nodeList.initNodeListContent()
  }

  change() {
    this._onChange('123')
  }

}