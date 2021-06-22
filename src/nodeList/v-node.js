import $ from './../util/dom-core'

const VNodeFlags = {
  SPAN: 1, // 带样式带文本
  LINK: 1 << 1 // 超链接
}

const SPAN = 'SPAN', LINK = 'A'

// 行内节点
class VNode {

  flag = undefined   // 节点类型

  text = undefined  // 节点文本
  
  attr = {}          // bold delete color

  constructor (option) {
    this.flag = option.flag || VNodeFlags.TEXT
    this.text = option.text || ''
    this.attr = {...option.attr}
  }

  // 节点切片，参考String.prototype.slice
  slice(start, end) {
    let _text = this.text.slice(start, end)
    return new VNode({
      text: _text,
      flag: this.flag,
      attr: this.attr
    })
  }

  // 更新节点
  update(cmd) {
    if (cmd === 'bold') {
      this.attr.bold = 1
    }
    if (cmd === 'italic') {
      this.attr.italic = 1
    }
    if (cmd === 'underLine') {
      this.attr.underLine = 1
    }
    if (cmd === 'strikeThrough') {
      this.attr.strikeThrough = 1
    }
  }

  html() {
    let _html = ''
    if (this.flag & VNodeFlags.SPAN) {
      let styleStr = ``
      if (this.attr.bold) {
        styleStr += 'font-weight: bold;'
      }
      if (this.attr.italic) {
        styleStr += 'font-style: italic;'
      }
      if (this.attr.underLine && this.attr.strikeThrough) {
        styleStr += 'text-decoration: line-through underline;'
      }
      if (!this.attr.underLine && this.attr.strikeThrough) {
        styleStr += 'text-decoration: line-through;'
      }
      if (this.attr.underLine && !this.attr.strikeThrough) {
        styleStr += 'text-decoration: underline;'
      }
      _html = `<span style="${styleStr}">${this.text}</span>`
    }
    return _html
  }

  static create = (domNode) => {
    let option = {
      flag: undefined,
      text: domNode.textContent,
      attr: {}
    }

    // 字体样式节点
    if (domNode.nodeType === 1 && domNode.nodeName === 'SPAN') {
      option.flag = VNodeFlags.SPAN
      domNode.style.fontWeight === 'bold' && (option.attr.bold = 1)
      domNode.style.textDecoration === 'line-through' && (option.attr.strikeThrough = 1)
      domNode.style.color && (option.attr.color = domNode.style.color)
    }

    // 超链接节点
    if (domNode.nodeType === 1 && domNode.nodeName === 'A') {
      option.flag = VNodeFlags.LINK
    }

    return new VNode(option)
  }

}

export default VNode
