import $ from './../util/dom-core'
import { getRandomStr } from './../util/util'
import { 
  EnterEvent,
  BoldEvent
} from './keyboard-events'

// 内容节点
class Node {

  $editor = null

  // 唯一标识符
  $key = undefined

  // 节点类型
  $type = 1

  // 元素类型
  $el = null

  // vnodes 为当前节点存储的子节点，目前主要应用于 type === 2 的容器节点
  $vnodes = []

  // 初始数据
  
  constructor(options, $editor) {
    this.$editor = $editor
    this.$key = options.id || getRandomStr()
    this.$type = options.$type
    this._init()
  }

  // 初始化节点
  _init() {
    this._initDom()
    this._initEvent()
  }

  // 初始化dom
  _initDom() {
    let node = $(`<div class="node-item" data-key="${this.$key}" data-type="${this.$type}">
      <div class="bullet-wrapper"></div>
      <div class="input-warp" contenteditable="true"><span><br/></span></div>
    </div>`)
    this.$el = node
  }

  // 事件初始化
  _initEvent() {
    this.$el.on('keydown', '.input-warp', (e) => {
      if (e.keyCode === 13) {
        EnterEvent(e, this)
      }
      if (e.keyCode === 66 && (e.ctrlKey || e.metaKey)) {
        BoldEvent(e, this)
      }
    })
  }

  focus() {
    this.$el.find('.input-warp').focus()
  }

  refreashContent(html) {
    this.$el.find('.input-warp').html(html)
  }

  insertAfter($node) {
    let $node_list = this.$editor.$nodeList.$list
    if (!$node) {
      $node_list.push(this)
      this.$editor.$nodeList.$el.append(this.$el)
    } else {
      let index = $node_list.length - 1
      $node_list.forEach((item, _index) => {
        if (item.$key === $node.$key) index = _index
      })
      $node_list.splice(index + 1, 0, this)
      this.$el.insertAfter($node_list[index].$el)
      this.focus()
    }
  }

}

export default Node