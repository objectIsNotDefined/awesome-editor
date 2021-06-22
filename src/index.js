import './assets/styles/index.less'

import $ from './util/dom-core'
import Content from './content/index'

class AwesomeEditor {

  $el = null  // 编辑器dom

  $content = null  // 编辑器内容

  constructor ({el, uploadImg}) {
    this.$el = $(el)
    this._init()
  }

  _init () {
    this._initEditor()
    this._initContent()
  }

  _initEditor () {
    this.$el.addClass('awesome-editor')
  }

  _initContent () {
    this.$content = new Content(this)
  }

  setValue (data = []) {
    this.$content.setValue(data)
  }

}

export default AwesomeEditor
