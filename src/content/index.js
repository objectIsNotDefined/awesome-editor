import $ from './../util/dom-core'
import Node from './../node/index'

class Content {

  $editor = null // 编辑器

  $el = null     // 内容挂载节点

  $nodes = []    // 内容列表

  constructor (editor) {
    this.$editor = editor
    this._init()
  }

  _init () {
    this._initContentWarp()
  }

  _initContentWarp () {
    const contentWarp = $(`<div class="content-warp"></div>`)
    this.$el = contentWarp
    this.$editor.$el.append(contentWarp)
  }

  // 设置编辑器内容
  setValue (data = []) {
    this.$nodes = []
    if (data.length === 0) {
      data = [
        {
          type: 'head',
          content: '标题',
          attr: { level: 1 }
        }
      ]
    }
    data.forEach(item => {
      let $node = new Node(item, this.$editor)
      $node.insertAfter(false)
    })
  }

}

export default Content