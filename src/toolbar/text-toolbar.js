import $ from '@/util/dom-core'

import {
  selectionFormat,
  getSelectionPosition
} from '@/helper/selection-helper'

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
    { title: '加粗', fn: 'bold' },
    { title: '斜体', fn: 'italic' },
    { title: '下划线', fn: 'underline' },
    { title: '中划线', fn: 'lineThrough' }
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
    let pos_x = (rangeInfo.left + rangeInfo.right) / 2
    let pos_y = rangeInfo.bottom + 10
    const handleIcons = this.$Fns.map(item => `<div class="handle-item" handle-key="${item.fn}">${item.title}</div>`)
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