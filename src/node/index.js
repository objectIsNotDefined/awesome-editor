import $ from './../util/dom-core'
import { getRandomStr } from './../util/util'
import { refreashNodeContent } from './node-helper'
import VNode from './v-node'
import { 
  EnterEvent,
  BoldEvent,
  DeleteUpEvent,
  DeleteDownEvent,
  ItalicEvent,
  UnderlineEvent,
  LineThroughEvent
} from './keyboard-events'
class Node {

  $editor = null  // 编辑器实例

  $key = null     // node唯一标识符

  $type = null    // 节点类型 1-标题 2-容器

  $el = null      // 节点元素

  $attr = {}

  constructor (options, $editor) {
    this.$editor = $editor
    this.$key = options.id || getRandomStr()
    this.$type = options.type || 1
    this.$attr = options.attr
    this._init(options)
  }

  _init (options) {
    this._initDom(options)
    this._initEvent()
  }

  // 初始化节点容器
  _initDom (options) {
    let classNames = ''
    if (this.$type === 1) {
      classNames = `heading${options?.attr?.level || 1}`
    }
    this.$el = $(`<div class="node-item ${classNames}" data-key="${this.$key}">
      <div class="bullet-wrapper"></div>
      <div class="input-warp" contenteditable="true"></div>
    </div>`)
    // 初始化内容
    if (this.$type === 1) {
      let $text = $(`<span>${options.content || '<br/>'}</span>`)
      this.$el.find('.input-warp').empty().append($text)
    }
    if (this.$type === 2) {
      let vnodes = []
      if (options.vnodes) {
        // 如果是空，则初始化一个vnode
        vnodes = options.vnodes.length? options.vnodes : [new VNode({type: 21, content: '', attr: {}})]
      } else {
        vnodes = options.child.map(item => VNode.create(item))
      }
      vnodes.forEach(vnode => {
        this.$el.find('.input-warp').append($(vnode.compile()))
      })
    }
  }

  // 绑定节点事件
  _initEvent () {
    this.$el.on('keydown', '.input-warp', (e) => {
      // 删除事件
      if (e.keyCode === 8) {
        DeleteDownEvent(e, this)
      }
      // 回车换行 enter
      if (e.keyCode === 13) {
        EnterEvent(e, this)
      }
      // 加粗 cmd/ctrl + B
      if (e.keyCode === 66 && (e.ctrlKey || e.metaKey)) {
        BoldEvent(e, this)
      }
      // 斜体 cmd/ctrl + I
      if (e.keyCode === 73 && (e.ctrlKey || e.metaKey)) {
        ItalicEvent(e, this)
      }
      // 下划线 cmd/ctrl + U
      if (e.keyCode === 85 && (e.ctrlKey || e.metaKey)) {
        UnderlineEvent(e, this)
      }
      // 中划线 cmd/ctrl + H
      if (e.keyCode === 72 && (e.ctrlKey || e.metaKey)) {
        LineThroughEvent(e, this)
      }
    })
    // 删除事件，keyup触发，保持容器结构
    this.$el.on('keyup', '.input-warp', (e) => {
      if (e.keyCode === 8) {
        DeleteUpEvent(e, this)
      }
    })
  }

  // 根据vnode刷新节点内容
  refreashByVnodes (nodeInfo) {
    refreashNodeContent(nodeInfo, this)
  }

  // 节点聚焦, 光标移动到最后
  focus() {
    this.$el.find('.input-warp').focus()
  }

  // 节点移除
  remove() {
    let editorNodes = this.$editor.$content.$nodes
    // 如果当前节点是编辑器唯一的节点，则不能删除
    if (editorNodes.length === 1) return
    this.$el.remove()
    let currentNodeIndex = editorNodes.indexOf(this)
    editorNodes.splice(currentNodeIndex, 1)
    if (currentNodeIndex === 0) {
      editorNodes[0].focus()
    } else {
      editorNodes[currentNodeIndex - 1].focus()
    }
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
      
    }
    this.focus()
  }

}

export default Node