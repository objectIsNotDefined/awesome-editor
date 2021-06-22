import $ from './../util/dom-core'

const VNodeFlags = {
  SPAN: 'SPAN', // 带样式带文本
  LINK: 'A' // 超链接
}

// 行内节点
class VNode {

  $flag = null  // 节点类型

  $text = null  // 节点文本
  
  $attr = {}    // bold delete color

  constructor (option) {
    this.flag = option.flag || VNodeFlags.SPAN
    this.text = option.text || ''
    this.$attr = { ...option.attr }
  }

  // 节点切片，参考String.prototype.slice
  slice (start, end) {
    let _text = this.text.slice(start, end)
    return new VNode({
      text: _text,
      flag: this.flag,
      attr: this.$attr
    })
  }

  // 更新节点
  update (cmd, val) {
    if (cmd === 'bold') {
      this.$attr.bold = this.$attr.bold? 0 : 1
    }
    if (cmd === 'color') {
      this.$attr.color = val
      !!!val && (delete this.$attr.color)
    }
    if (cmd === 'underline') {
      this.$attr.underline = this.$attr.underline? 0 : 1
    }
    if (cmd === 'lineThrough') {
      this.$attr.lineThrough = this.$attr.lineThrough? 0 : 1
    }
  }

  compile () {
    let element = document.createElement(this.$flag)
    element.innerHTML = this.$text
    if(this.$flag === VNodeFlags.SPAN) {
      // 字体加粗
      option.attr.bold && (element.style.fontWeight = 'bold')
      // 字体颜色
      option.attr.color && (element.style.color = option.attr.color)
      // 处理下划线/中划线
      let textDecoration = ''
      option.attr.underline && (textDecoration += 'underline')
      option.attr.lineThrough && (textDecoration += ' line-through')
      if (textDecoration) {
        element.style.textDecoration = textDecoration
      }
    }
    if (this.$flag === VNodeFlags.LINK) {
      element.setAttribute('href', this.$attr.url)
    }
    return element
  }

  static create = (domNode) => {
    let option = {
      flag: undefined,
      text: domNode.textContent,
      attr: {}
    }

    // 文本节点
    if (domNode.nodeType === 1 && domNode.nodeName === 'SPAN') {
      option.flag = VNodeFlags.SPAN
      // 加粗
      domNode.style.fontWeight === 'bold' && (option.attr.bold = 1)
      // 中划线
      domNode.style.textDecoration.includes('line-through') && (option.attr.lineThrough = 1)
      domNode.style.textDecoration.includes('underline') && (option.attr.underline = 1)
      // 字体颜色
      domNode.style.color && (option.attr.color = domNode.style.color)
    }

    // 超链接节点
    if (domNode.nodeType === 1 && domNode.nodeName === 'A') {
      option.flag = VNodeFlags.LINK
      option.attr.url = domNode.getAttribute('href') || ''
    }

    return new VNode(option)
  }

}

export default VNode
