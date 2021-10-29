import $ from '@/util/dom-core'
import { getRandomStr } from '@/util/util'
import VNode from './vnode'
import NodeToolbar from '@/toolbar/node-toolbar'
import TextToolbar from '@/toolbar/text-toolbar'
import TableToolbar from '@/toolbar/table-toolbar'

import Icon from '@/assets/icon'

import {
  DeleteDownEvent,
  DeleteUpEvent,
  EnterEvent,
  BoldEvent,
  ItalicEvent,
  UnderlineEvent,
  LineThroughEvent,
  CopyEvent,
  PasteEvent,
  HyperlinkEvent
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
      classNames = `head${options?.attr?.level || 1}`
    }
    this.$el = $(`<div class="node-item ${classNames}" data-key="${this.$key}">
      <div class="bullet-wrapper">${Icon.Add}</div>
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
      <div class="bullet-wrapper">${Icon.Add}</div>
      <div class="image-wrapper">
        <div class="image-box">
          <div class="delete">${Icon.Delete}</div>
          <img src="${this.$attr.url}" alt="">
        </div>
      </div>
    </div>`)
  }

  // 初始化表格节点
  #initTableNodeDom (options) {
    const tableRows = options.attr.data.map((item, index) => {
      const columnItems = item.map((val, _index) => `<td><input data-row="${index}" data-col="${_index}" type="text" value="${val}"></td>`)
      return `<tr>${columnItems.join('')}</tr>`
    })
    this.$el = $(`<div class="node-item node-type-table" data-key="${this.$key}">
      <div class="bullet-wrapper">${Icon.Add}</div>
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
      // 添加超链接
      if (e.keyCode === 75 && (e.ctrlKey || e.metaKey)) {
        HyperlinkEvent(e, this)
      }
    })
    // 删除事件，keyup触发，保持容器结构
    this.$el.on('keyup', '.input-wrap', (e) => {
      if (e.keyCode === 8) {
        DeleteUpEvent(e, this)
      }
    })
    // 复制
    this.$el.find('.input-wrap').on('copy', (e) => {
      CopyEvent(e, this)
    })
    // 粘贴
    this.$el.find('.input-wrap').on('paste', '', (e) => {
      PasteEvent(e, this)
    })

    // mouseup 触发是否需要显示文字处理弹窗
    this.$el.find('.input-wrap').on('mouseup', (e) => {
      TextToolbar.show(e, this)
    })

    // 点击文本事件
    this.$el.on('click', '.text-link', (e) => {
      window.open($(e.target).attr('url'))
    })

  }

  // image 节点
  #bindImageEvent () {
    this.$el.find('.delete').on('click', (e) => {
      this.remove()
    })
  }

  // table 节点
  #bindTableEvent () {
    this.$el.find('input').on('focus', (e) => {
      TableToolbar.show(e, this)
    })
    this.$el.find('input').on('blur', (e) => {
      // TableToolbar.destroy()
    })
  }

  // 获取表格节点内容
  getTableData () {
    if (this.$type !== 'table') return false
    return [...this.$el.find('tr').nodeList].map(row => {
      return [...row.childNodes].map(td => $(td).find('input').nodeList[0].value)
    })
  }

  // 通过数据设置表格内容
  setTableData (data) {
    const tableRows = data.map((item, index) => {
      const columnItems = item.map((val, _index) => `<td><input data-row="${index}" data-col="${_index}" type="text" value="${val}"></td>`)
      return `<tr>${columnItems.join('')}</tr>`
    })
    const newTable = $(`<table><tbody>${tableRows.join('')}</tbody></table>`)
    this.$el.find('.table-wrapper').empty().append(newTable)
    this.#bindTableEvent()
    this.$editor.triggerChange()
  }

  triggerHover (status) {
    if (status) {
      this.$el.addClass('hovered')
    } else {
      this.$el.removeClass('hovered')
    }
  }

  // 刷新文字节点内容
  update (nodeInfo) {
    updateNodeContent(nodeInfo, this)
  }

  // 更新文字节点，包括节点类型等
  updateNode (nodeInfo) {
    if (nodeInfo.type === this.$type && nodeInfo.attr.level === this.$attr.level) return
    this.$type = nodeInfo.type
    this.$attr = { ...nodeInfo.attr }
    let nodeClassNames = `node-item`
    if (nodeInfo.type === 'head') {
      nodeClassNames += ` head${nodeInfo.attr.level}`
    }
    this.$el.class(nodeClassNames)
    updateNodeContent({ vnodes_l: nodeInfo.vnodes, vnodes_m: [], vnodes_r: [] }, this)
  }

  // 节点聚焦
  focus(pos = undefined) {
    this.$el.find('.input-wrap').focus(pos)
  }

  // 节点移除
  remove() {
    let editorNodes = this.$editor.$nodes
    // 如果当前节点是编辑器唯一的节点，则不能删除
    if (editorNodes.length === 1 && this.$type === 'paragraph') return
    this.$el.remove()
    let currentNodeIndex = editorNodes.indexOf(this)
    editorNodes.splice(currentNodeIndex, 1)
    if (editorNodes.length === 0) {
      const newNode = new Node({
        type: 'paragraph',
        child: []
      }, this.$editor)
      newNode.insertAfter()
    } else if (currentNodeIndex === 0) {
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
    this.$editor.triggerChange()
  }

}

export default Node