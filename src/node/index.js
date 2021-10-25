import $ from '@/util/dom-core'
import { getRandomStr } from '@/util/util'
import VNode from './vnode'
import NodeToolbar from '@/toolbar/node-toolbar'

import {
  DeleteDownEvent,
  DeleteUpEvent,
  EnterEvent,
  BoldEvent,
  ItalicEvent,
  UnderlineEvent,
  LineThroughEvent,
  CopyEvent,
  PasteEvent
} from '@/helper/event-helper'

import {
  updateNodeContent
} from '@/helper/node-helper'

class Node {

  $editor = null  // 编辑器实例

  $type = null    // 节点类型 head-标题 paragraog-容器

  $el = null      // 节点dom

  $attr = {}      // 节点属性

  $key = null     // node唯一标识符

  constructor (options, $editor) {
    if (options.attr) {
      options.attr = { ...options.attr }
    }
    this.$editor = $editor
    this.$type = options.type || 'paragraph'
    this.$attr = options.attr || {}
    this.$key = getRandomStr()
    this.#init(options)
  }

  #init (options) {
    this.#initDom(options)
    this.#bindEvent()
  }

  // 初始化节点容器
  #initDom (options) {
    if (['head', 'paragraph'].includes(this.$type)) {
      this.#initTextNodeDom(options)
    }
    if (['image'].includes(this.$type)) {
      this.#initImageNodeDom(options)
    }
    if (['table'].includes(this.$type)) {
      this.#initTableNodeDom(options)
    }
  }

  // 初始化head、paragraph节点
  #initTextNodeDom (options) {
    let classNames = ''
    if (this.$type === 'head') {
      classNames = `heading${options?.attr?.level || 1}`
    }
    this.$el = $(`<div class="node-item ${classNames}" data-key="${this.$key}">
      <div class="bullet-wrapper"></div>
      <div class="input-wrap" contenteditable="true"></div>
    </div>`)
    // 初始化内容
    if (this.$type === 'head') {
      let $text = $(`<span>${options.content || '<br/>'}</span>`)
      this.$el.find('.input-wrap').empty().append($text)
    }
    if (this.$type === 'paragraph') {
      let vnodes = []
      if (options.vnodes) {
        // 如果是空，则初始化一个vnode
        vnodes = options.vnodes.length? options.vnodes : [new VNode({ type: 'text', content: '' })]
      } else {
        if (options.child.length === 0) {
          options.child = [
            { type: 'text', content: '', attr: {} }
          ]
        }
        vnodes = options.child.map(item => VNode.create(item))
      }
      vnodes.forEach(vnode => {
        this.$el.find('.input-wrap').append($(vnode.compile()))
      })
    }
  }

  // 初始化图片节点
  #initImageNodeDom (options) {
    this.$el = $(`<div class="node-item node-type-image" data-key="${this.$key}">
      <div class="bullet-wrapper"></div>
      <div class="image-wrapper">
        <div class="image-box">
          <img src="${this.$attr.url}" alt="">
        </div>
      </div>
    </div>`)
  }

  // 初始化表格节点
  #initTableNodeDom (options) {
    console.log(options.attr.data)
    const tableRows = options.attr.data.map((item) => {
      const columnItems = item.map((val) => `<td><input type="text" value=${val}></td>`)
      return `<tr>${columnItems.join('')}</tr>`
    })
    this.$el = $(`<div class="node-item node-type-table" data-key="${this.$key}">
      <div class="bullet-wrapper"></div>
      <div class="table-wrapper">
        <table>
          <tbody>
            ${tableRows.join('')}
          </tbody>
        </table>
      </div>
    </div>`)
  }

  // 绑定节点事件
  #bindEvent () {
    if (['head', 'paragraph'].includes(this.$type)) {
      this.#bindTextEvent()
    }
    if (this.$type === 'image') {
      this.#bindImageEvent()
    }
    if (this.$type === 'table') {
      this.#bindTableEvent()
    }

    // 绑定左侧操作按钮
    this.$el.on('mouseover', '.bullet-wrapper', (e) => {
      NodeToolbar.show(this)
    })
    this.$el.on('mouseout', '.bullet-wrapper', (e) => {
      NodeToolbar.hide(this)
    })
  }

  // head 节点
  #bindTextEvent () {
    this.$el.on('keydown', '.input-wrap', (e) => {
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
    this.$el.on('keyup', '.input-wrap', (e) => {
      if (e.keyCode === 8) {
        DeleteUpEvent(e, this)
      }
    })
    // 复制/粘贴事件
    this.$el.find('.input-wrap').on('copy', (e) => {
      CopyEvent(e, this)
    })
    this.$el.find('.input-wrap').on('paste', '', (e) => {
      PasteEvent(e, this)
    })
  }

  // image 节点
  #bindImageEvent () {
    
  }

  // table 节点
  #bindTableEvent () {

  }

  triggerHover (status) {
    if (status) {
      this.$el.addClass('hovered')
    } else {
      this.$el.removeClass('hovered')
    }
  }

  // 刷新节点内容
  update (nodeInfo) {
    updateNodeContent(nodeInfo, this)
  }

  // 节点聚焦
  focus(pos = undefined) {
    this.$el.find('.input-wrap').focus(pos)
  }

  // 节点移除
  remove() {
    let editorNodes = this.$editor.$nodes
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
    const $editorEl = this.$editor.$el
    const $nodes = this.$editor.$nodes
    if ($node) {
      let insertIndex = $nodes.length - 1
      $nodes.forEach((item, index) => {
        if (item.$key === $node.$key) insertIndex = index
      })
      $nodes.splice(insertIndex + 1, 0, this)
      this.$el.insertAfter($nodes[insertIndex].$el)
    } else {
      $nodes.push(this)
      $editorEl.append(this.$el)
    }
    this.focus()
  }

}

export default Node