import '@/styles/index.less'

import $ from '@/util/dom-core'
import Node from '@/node'

class AwesomeEditor {

  $el = null  // 编辑器dom

  $content = null  // 编辑器内容

  $nodes = [] // 节点列表

  #initialContent = []

  constructor ({el, uploadImg, onChange, content = []}) {
    this.$el = $(el)
    this.#initialContent = content
    this.#init()
  }

  #init () {
    this.#initEditor()
  }

  #initEditor () {
    this.$el.addClass('awesome-editor')
    this.update(this.#initialContent)
  }

  // 手动更新编辑器内容
  update (content = []) {
    console.log('更新编辑器内容', content)
    // 先清空编辑器
    this.$el.empty()
    // 遍历节点
    this.$nodes = content.map(item => {
      const $node = new Node(item, this)
      $node.insertAfter(false)
      return $node
    })
  }

  // 创建编辑器
  static create ({ el, uploadImg, onChange, content = [] }) {
    const Editor = new AwesomeEditor({ el, uploadImg, onChange, content })
    Editor.update()
  }

}

export default AwesomeEditor
