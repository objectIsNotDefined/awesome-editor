import $ from '@/util/dom-core'
import Icon from '@/assets/icon'

import {
  selectionFormat,
  getSelectionPosition
} from '@/helper/selection-helper'

import {
  getToolbarPosition
} from '@/helper/toolbar-helper'

import {
  runCmd
} from '@/helper/node-helper'

class Toolbar {

  $el = null

  // 当前操作节点
  #CurrentNode = null

  // 当前节点vnode缓存
  #VNodeCache = null

  $Fns = [
    { icon: Icon.H1, title: '大标题', fn: 'head1' },
    { icon: Icon.H2, title: '中标题', fn: 'head2' },
    { icon: Icon.H3, title: '小标题', fn: 'head3' },
    { icon: Icon.P,  title: '段落', fn: 'paragraph' },
    { icon: Icon.B, title: '加粗', fn: 'bold' },
    { icon: Icon.I, title: '斜体', fn: 'italic' },
    { icon: Icon.U, title: '下划线', fn: 'underline' },
    { icon: Icon.S, title: '中划线', fn: 'lineThrough' },
    { icon: Icon.Link, title: '超链接', fn: 'hyperlink'}
  ]

  constructor () {
    document.addEventListener('mouseup', (e) => {
      if (this.$el && !this.$el.nodeList[0].contains(e.target)) {
        this.destroy()
      }
    }, true)
  }

  #create () {
    const rangeInfo = getSelectionPosition()
    let { pos_x, pos_y } = getToolbarPosition(rangeInfo, { width: 448, height: 60 })
    const handleIcons = this.$Fns.map(item => {
      return `<div class="handle-item" title="${item.title}" handle-key="${item.fn}">${item.icon}</div>`
    })
    this.$el = $(`<div class="text-toolbar-wrap" style="left: ${pos_x}px; top: ${pos_y}px;">
      ${handleIcons.join('')}
    </div>`)
    this.#CurrentNode.$editor.$el.append(this.$el)
    this.#bindEvent()
  }

  #bindEvent () {
    this.$el.on('click', '.handle-item', (e) => {
      const handleKey = $(e.target).attr('handle-key')
      runCmd(this.#VNodeCache, this.#CurrentNode, handleKey)
    })
  }

  show (e, $node) {
    const $inputEl = $node.$el.find('.input-wrap')
    let { vnodes_l, vnodes_m, vnodes_r } = selectionFormat($inputEl.nodeList[0])
    if (vnodes_m.length) {
      this.#CurrentNode = $node
      this.#VNodeCache = { vnodes_l, vnodes_m, vnodes_r }
      this.#create()
    }
  }

  destroy () {
    this.#CurrentNode = null
    this.#VNodeCache = null
    this.$el && this.$el.remove()
    this.$el = null
  }

}

const TextToolbar = new Toolbar()

export default TextToolbar