import $ from '@/util/dom-core'
import TextToolbar from '@/toolbar/text-toolbar'
import VNode from '@/node/vnode'

import {
  getSelectionPosition
} from '@/helper/selection-helper'

import {
  updateNodeContent
} from '@/helper/node-helper'

class Toolbar {

  $el = null

  // 当前操作节点
  #CurrentNode = null

  // 当前节点信息缓存
  #VNodeCache = null

  constructor () {
    document.addEventListener('mouseup', (e) => {
      if (this.$el && !this.$el.nodeList[0].contains(e.target)) {
        this.destroy()
      }
    }, true)
  }

  #create () {
    // 获取浮层需要出现的位置
    const rangeInfo = getSelectionPosition()
    let pos_x = (rangeInfo.left + rangeInfo.right) / 2
    let pos_y = rangeInfo.bottom + 10
    this.$el = $(`<div class="hyperlink-toolbar-wrap" style="left: ${pos_x}px; top: ${pos_y}px;">
      <label>文本 <input type="text" class="text-input" placeholder="输入文本"></label>
      <label>链接 <input type="text" class="link-input" placeholder="输入链接"></label>
    </div>`)
    this.#CurrentNode.$editor.$el.append(this.$el)
    this.#bindEvent()
  }

  // 绑定相关事件
  #bindEvent () {
    // 获取预设信息
    let rangeObj = this.#VNodeCache.vnodes_m.reduce((res, vnode) => {
      res.txt += vnode.$content
      if (res.url && res.urlIsEqual && res.url !== vnode.$attr.url) {
        res.urlIsEqual = false
      } else if (!res.url) {
        res.url = vnode.$attr.url || ''
      }
      return res
    }, {
      txt: '',
      url: '',
      urlIsEqual: true
    })
    this.$el.find('.text-input').nodeList[0].focus()
    this.$el.find('.text-input').nodeList[0].value = rangeObj.txt
    rangeObj.urlIsEqual && (this.$el.find('.link-input').nodeList[0].value = rangeObj.url)
    this.$el.find('.link-input').on('keydown', (e) => {
      if (e.keyCode === 13) {
        e.stopPropagation()
        e.preventDefault()
        const link_text = this.$el.find('.text-input').nodeList[0].value
        const link_url = this.$el.find('.link-input').nodeList[0].value
        if (link_text.trim().length && link_url.trim().length) {
          this.$el.removeClass('error')
          updateNodeContent({
            vnodes_l: this.#VNodeCache.vnodes_l,
            vnodes_m: [new VNode({ type: 'link', content: link_text, attr: { url: link_url } })],
            vnodes_r: this.#VNodeCache.vnodes_r
          }, this.#CurrentNode)
          this.destroy()
        } else {
          this.$el.addClass('error')
        }
      }
    })
    this.$el.find('.text-input').on('keydown', (e) => {
      if (e.keyCode === 13) {
        e.stopPropagation()
        e.preventDefault()
        this.$el.find('.link-input').nodeList[0].focus()
      }
    })
  }

  show ({ vnodes_l, vnodes_m, vnodes_r }, $node) {
    TextToolbar.destroy()
    this.#VNodeCache = { vnodes_l, vnodes_m, vnodes_r }
    this.#CurrentNode = $node
    this.#create()
  }

  destroy () {
    this.#CurrentNode = null
    this.#VNodeCache = null
    this.$el && this.$el.remove()
    this.$el = null
  }

}

const HyperlinkToolbar = new Toolbar()

export default HyperlinkToolbar