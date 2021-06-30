import $ from './../util/dom-core'
import { deepEqual } from './../util/util'

const VNodeFlags = {
  TEXT: 'SPAN', // 带样式带文本
  LINK: 'A' // 超链接
}

// 行内节点
class VNode {

  $flag = null  // 节点类型

  $text = null  // 节点文本
  
  $attr = {}    // bold delete color

  $ele = null   // 节点的dom映射

  constructor (option) {
    this.$flag = option.flag || VNodeFlags.TEXT
    this.$text = option.text || ''
    this.$attr = { ...option.attr }
  }

  // 节点切片，参考String.prototype.slice
  slice (start, end) {
    let _text = this.$text.slice(start, end)
    return new VNode({
      text: _text,
      flag: this.$flag,
      attr: this.$attr
    })
  }

  // 更新内容
  updateContent (val) {
    this.$text = val
  }

  // 更新节点
  update (cmd, val) {
    this.$attr[cmd] = val
  }

  compile () {
    let element = document.createElement(this.$flag)
    element.innerHTML = this.$text || '<br/>'
    if(this.$flag === VNodeFlags.TEXT) {
      let classList = []
      Object.keys(this.$attr).forEach(key => {
        if (key === 'color') {
          classList.push(`text-color-${this.$attr[key]}`)
        } else if (this.$attr[key]) {
          classList.push(key)
        }
      })
      if (classList.length) {
        element.className = classList.join(' ')
      }
    }
    if (this.$flag === VNodeFlags.LINK) {
      element.setAttribute('href', this.$attr.url)
    }
    this.$ele = element
    return element
  }

  // 判断两个节点是否相似(除了文本内容不一样，其他都一样)
  isSimilarTo (vnode) {
    let result = true
    if (this.$flag !== vnode.$flag) {
      result = false
    }
    if (!deepEqual(this.$attr, vnode.$attr)) {
      result = false
    }
    return result
  }

  // 根据Element创建vnode
  static createByElement = (ele) => {
    const _option = {
      flag: undefined,
      text: ele.textContent,
      attr: {}
    }
    if (ele.nodeType === 1 && ele.nodeName === 'SPAN') {
      _option.flag = VNodeFlags.TEXT
      let attrOptions = ['bold', 'underline', 'lineThrough', 'italic']
      let classList = [...ele.classList]
      attrOptions.forEach(key => {
        classList.includes(key) && (_option.attr[key] = 1)
      })
      if (classList.includes('text-color-red')) {
        _option.attr.color = 'red'
      }
      if (classList.includes('text-color-green')) {
        _option.attr.color = 'green'
      }
      if (classList.includes('text-color-yellow')) {
        _option.attr.color = 'yellow'
      }
    }
    // 超链接节点
    if (ele.nodeType === 1 && ele.nodeName === 'A') {
      _option.flag = VNodeFlags.LINK
      _option.attr.url = ele.getAttribute('href') || ''
    }
    return new VNode(_option)
  }

  // 根据编辑器原始数据创建vnode
  static createByData = (data) => {
    let typeFlagMap = {
      [21]: VNodeFlags.TEXT,
      [22]: VNodeFlags.LINK
    }
    const _option = {
      flag: typeFlagMap[data.type],
      text: data.content,
      attr: { ...data.attr }
    }
    return new VNode(_option)
  }

  // 创建vnode
  static create = (source) => {
    if (source instanceof Element) {
      return VNode.createByElement(source)
    }
    if (source instanceof Object) {
      return VNode.createByData(source)
    }
  }

  // VNodeList格式化，合并处理相邻的相似节点
  static formatVNodes = (list) => {
    let _list = []
    for (let i = 0, len = list.length; i < len; i++) {
      let node = list[i]
      let prevNode = _list[_list.length - 1]
      if (node.$text.length === 0) continue
      // 如果已经有值
      if (prevNode && node.isSimilarTo(prevNode)) {
        prevNode.updateContent(prevNode.$text + node.$text)
      } else {
        _list.push(node)
      }
    }
    return _list
  }

}

export default VNode
