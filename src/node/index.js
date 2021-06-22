import $ from './../util/dom-core'
import { getRandomStr } from './../util/util'
import { 
  EnterEvent,
  BoldEvent
} from './keyboard-events'
class Node {

  $editor = null  // 编辑器实例

  $key = null     // node唯一标识符

  $type = null    // 节点类型 1-标题 2-容器

  $el = null      // 节点元素

  $vnodes = []    // 节点内部vnodes(用于描述节点信息)

  constructor (options, $editor) {
    this.$editor = $editor
    this.$key = options.id || getRandomStr()
    this.$type = options.type || 1
    this.__initialVal = options.content
    this._init(options)
  }

  _init (options) {
    this._initDom(options)
    this._initEvent()
  }

  // 初始化节点容器
  _initDom (options) {
    let contentHtml = ''
    if (options.type === 1) {
      contentHtml = `<span>${options.content || '<br/>'}</span>`
    }
    if (options.type === 2) {
      contentHtml = options.child.reduce((cur, item) => {
        // 如果是文本节点
        if (item.type === 21 && item.content) {
          let stylesArr = []
          // 字体加粗
          item.attr.bold && (stylesArr.push('font-weight: bold'))
          // 字体颜色
          item.attr.color && (stylesArr.push(`color: ${item.attr.color}`))
          // 处理下划线/中划线
          let textDecoration = ''
          item.attr.underline && (textDecoration += 'underline')
          item.attr.lineThrough && (textDecoration += ' line-through')
          if (textDecoration) {
            stylesArr.push(`text-decoration: ${textDecoration}`)
          }
          cur += `<span style="${stylesArr.join(';')}">${item.content}</span>`    
        }
        return cur
      }, '')
      contentHtml = contentHtml || `<span><br/></span>`
    }
    let node = $(`<div class="node-item" data-key="${this.$key}" data-type="${this.$type}">
      <div class="bullet-wrapper"></div>
      <div class="input-warp" contenteditable="true">${contentHtml}</div>
    </div>`)
    this.$el = node
  }

  // 绑定节点事件
  _initEvent () {
    this.$el.on('keydown', '.input-warp', (e) => {
      if (e.keyCode === 13) {
        EnterEvent(e, this)
      }
      if (e.keyCode === 66 && (e.ctrlKey || e.metaKey)) {
        BoldEvent(e, this)
      }
    })
  }

  // 节点聚焦
  focus() {
    this.$el.find('.input-warp').focus()
  }

  // 将节点插入制定位置
  insertAfter($node = false) {
    const $nodeList = this.$editor.$content.$nodes
    const $contentEl = this.$editor.$content.$el
    if (!$node) {
      $nodeList.push(this)
      $contentEl.append(this.$el)
    } else {
      let index = $nodeList.length - 1
      $nodeList.forEach((item, _index) => {
        if (item.$key === $node.$key) index = _index
      })
      $nodeList.splice(index + 1, 0, this)
      this.$el.insertAfter($nodeList[index].$el)
      this.focus()
    }
  }

}

export default Node