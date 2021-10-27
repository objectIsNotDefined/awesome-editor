import $ from '@/util/dom-core'
import { deepEqual } from '@/util/util'

// 行内节点
class VNode {

  $type = 'text'

  $content = ''  // 节点内容

  $attr = {}     // bold underline lineThrough color ...

  $ele = null    // 节点原生dom

  constructor (option = {}) {
    option = Object.assign({ type: 'text', content: '', attr: {} }, option)
    this.$type = option.type
    this.$content = option.content || ''
    this.$attr = { ...option.attr }
  }

  // 节点切片，类 String.prototype.slice
  slice (start, end) {
    let text = this.$content.slice(start, end)
    return new VNode({
      type: this.$type,
      content: text,
      attr: { ...this.$attr }
    })
  }

  // 拷贝一份数据
  clone () {
    return new VNode({
      type: this.$type,
      content: this.$content,
      attr: { ...this.$attr }
    })
  }

  // 更新内容
  updateContent (val) {
    this.$content = val
  }

  // 更新节点属性
  updateAttr (cmd, val) {
    if (this.$type === 'text') {
      this.$attr[cmd] = val
    }
  }

  // 将节点编译为dom
  compile () {
    const ele = document.createElement('SPAN')
    ele.innerHTML = this.$content || '<br/>'
    const classList = []
    if (this.$type === 'text') {
      Object.keys(this.$attr).forEach(key => {
        if (key === 'color' && this.$attr[key]) {
          classList.push(`text-color-${this.$attr[key]}`)
        } else if (this.$attr[key]) {
          classList.push(key)
        }
      })
    }
    if (this.$type === 'link') {
      classList.push('text-link')
      ele.setAttribute('url', this.$attr.url)
    }
    ele.className = classList.join(' ')
    this.$ele = ele
    return ele
  }

  // 判断节点是否相似，除了文本不一样，其余一样
  isSimilarTo (target) {
    let result = true
    if (this.$type !== target.$type) result = false
    if (!deepEqual(this.$attr, target.$attr)) result = false
    return result
  }

  // 创建Vnode
  static create (source) {
    if (source instanceof Element) {
      return VNode.createByElement(source)
    }
    if (source instanceof Object) {
      return VNode.createByData(source)
    }
  }

  // 根据配置创建VNode
  static createByData (data) {
    return new VNode({
      type: data.type,
      content: data.content || '',
      attr: { ...data.attr }
    })
  }

  // 根据Dom创建Vnode
  static createByElement (ele) {
    const _default = { type: 'text', content: '', attr: {} }
    // 节点文本内容
    _default.content = ele.textContent
    if (ele.nodeType && ele.nodeName === 'SPAN') {
      const classList = [...ele.classList]
      // 判断是否为【link】节点
      if (classList.includes('text-link')) {
        _default.type = 'link'
        _default.attr.url = ele.getAttribute('url')
      } else {
        let attrOptions = ['bold', 'underline', 'lineThrough', 'italic']
        attrOptions.forEach(key => {
          classList.includes(key) && (_default.attr[key] = 1)
        })
        if (classList.includes('text-color-red')) {
          _default.attr.color = 'red'
        }
        if (classList.includes('text-color-green')) {
          _default.attr.color = 'green'
        }
        if (classList.includes('text-color-yellow')) {
          _default.attr.color = 'yellow'
        }
      }
    }
    return new VNode(_default)
  }

}

export default VNode