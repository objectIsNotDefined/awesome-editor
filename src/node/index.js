import $ from './../util/dom-core'
import { getRandomStr } from './../util/util'
import { refreashNodeContent } from './node-helper'
import VNode from './v-node'
import { 
  EnterEvent,
  BoldEvent,
  DeleteEvent
} from './keyboard-events'
class Node {

  $editor = null  // 编辑器实例

  $key = null     // node唯一标识符

  $type = null    // 节点类型 1-标题 2-容器

  $el = null      // 节点元素

  constructor (options, $editor) {
    this.$editor = $editor
    this.$key = options.id || getRandomStr()
    this.$type = options.type || 1
    this.__initialVal = options.content
    this._init(options)
  }

  _init (options) {
    this._initDom(options)
    this._initEvent()
  }

  // 初始化节点容器
  _initDom (options) {
    this.$el = $(`<div class="node-item" data-key="${this.$key}">
      <div class="bullet-wrapper"></div>
      <div class="input-warp" contenteditable="true"></div>
    </div>`)
    // 初始化内容
    if (this.$type === 1) {
      let $text = $(`<span>${options.content}</span>`)
      this.$el.find('.input-warp').empty().append($text)
    }
    if (this.$type === 2) {
      let vnodes = options.child.map(item => VNode.create(item))
      vnodes.forEach(vnode => {
        this.$el.find('.input-warp').append($(vnode.compile()))
      })
    }
  }

  // 绑定节点事件
  _initEvent () {
    this.$el.on('keydown', '.input-warp', (e) => {
      if (e.keyCode === 13) {
        EnterEvent(e, this)
      }
      if (e.keyCode === 66 && (e.ctrlKey || e.metaKey)) {
        BoldEvent(e, this)
      }
      if (e.keyCode === 8) {
        DeleteEvent(e, this)
      }
    })
  }

  // 根据vnode刷新节点内容
  refreashByVnodes (nodeInfo) {
    refreashNodeContent(nodeInfo, this)
  }

  // 节点聚焦
  focus() {
    this.$el.find('.input-warp').focus()
  }

  // 将节点插入制定位置
  insertAfter($node = false) {
    const $nodeList = this.$editor.$content.$nodes
    const $contentEl = this.$editor.$content.$el
    if (!$node) {
      $nodeList.push(this)
      $contentEl.append(this.$el)
    } else {
      let index = $nodeList.length - 1
      $nodeList.forEach((item, _index) => {
        if (item.$key === $node.$key) index = _index
      })
      $nodeList.splice(index + 1, 0, this)
      this.$el.insertAfter($nodeList[index].$el)
      this.focus()
    }
  }

}

export default Node