import $ from '@/util/dom-core'
import { getRandomStr } from '@/util/util'
import VNode from './vnode'

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
  refreashNodeContent,
  updateNodeContent
} from '@/helper/node-helper'

class Node {

  $editor = null  // 编辑器实例

  $type = null    // 节点类型 head-标题 paragraog-容器

  $el = null      // 节点dom

  $attr = {}      // 节点属性

  $key = null     // node唯一标识符

  constructor (options, $editor) {
    this.$editor = $editor
    this.$type = options.type || 'paragraph'
    this.$attr = options.attr || {}
    this.$key = getRandomStr()
    this.#init(options)
  }

  #init (options) {
    this.#initDom(options)
    this.#initEvent()
  }

  // 初始化节点容器
  #initDom (options) {
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
        vnodes = options.child.map(item => VNode.create(item))
      }
      vnodes.forEach(vnode => {
        this.$el.find('.input-wrap').append($(vnode.compile()))
      })
    }
  }

  // 绑定节点事件
  #initEvent () {
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
    this.$el.on('copy', (e) => {
      CopyEvent(e, this)
    })
    this.$el.on('paste', (e) => {
      PasteEvent(e, this)
    })

    let timmerId = null

    // 绑定左侧操作按钮
    this.$el.on('mouseover', '.bullet-wrapper', function (e) {
      clearTimeout(timmerId)
      timmerId = setTimeout(() => {
        console.log('显示工具栏')
      }, 1000)
    })
    this.$el.on('mouseout', '.bullet-wrapper', function (e) {
      clearTimeout(timmerId)
      timmerId = setTimeout(() => {
        console.log('关闭工具栏')
      }, 1000)
    })
  }

  // 根据vnode刷新节点内容
  refreashByVnodes (nodeInfo) {
    refreashNodeContent(nodeInfo, this)
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