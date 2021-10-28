import $ from '@/util/dom-core'
import Node from '@/node'
import Icon from '@/assets/icon'
import HyperlinkToolbar from '@/toolbar/hyperlink-toolbar'

// 行节点-工具栏
class Toolbar {

  $el = null

  // 当前弹窗所属node
  #CurrentNode = null

  // 计时器
  #HideTimmer = null

  #ShowTimmer = null

  #Fns = [
    { icon: Icon.P, title: '段落', fn: 'insertParagraph' },
    { icon: Icon.H1, title: '大标题', fn: 'insertH1' },
    { icon: Icon.H2, title: '中标题', fn: 'insertH2' },
    { icon: Icon.H3, title: '小标题', fn: 'insertH3' },
    { type: 'split-line' },
    { icon: Icon.Link, title: '链接', fn: 'insertLink'},
    { icon: Icon.Img, title: '图片', fn: 'insertImage'},
    { icon: Icon.Table, title: '表格', fn: 'insertTable'}
  ]

  constructor () {
    
  }

  #initToolbarDom () {

  }

  #create ($node) {
    this.#CurrentNode = $node
    this.#CurrentNode.triggerHover(true)
    // console.log(IconP)
    // 获取工具栏所属位置
    let { left, top, right, bottom } = $node.$el.find('.bullet-wrapper').nodeList[0].getBoundingClientRect()
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    if (top + 30 + 341 > windowHeight) {
      top = top - 30 - 341
    }
    const wrapper = document.createElement('div')
    const handleItems = this.#Fns.reduce((str, item) => {
      if (item.type === 'split-line') {
        str += '<p class="split-line"></p>'
      } else if (item.fn !== 'insertLink' || this.#CurrentNode.$type === 'paragraph') {
        str += `<div class="insert-node" handle-key="${item.fn}">
          ${item.icon}
          ${item.title}
        </div>`
      }
      return str
    }, '')
    this.$el = $(`<div class="node-toolbar-wrap" style="left: ${left}px; top: ${top + 30}px;">
        <p class="toolbar-title">插入内容</p>
        ${handleItems}
      </div>`)
    $node.$editor.$el.append(this.$el)
    this.#bindEvent()
  }

  // 绑定弹窗事件
  #bindEvent () {
    // 绑定左侧操作按钮
    this.$el.on('mouseover', (e) => {
      clearTimeout(this.#HideTimmer)
    })
    this.$el.on('mouseout', (e) => {
      this.hide(this.#CurrentNode)
    })
    this.$el.on('click', '.insert-node', async (e) => {
      const handleKey = $(e.target).attr('handle-key')
      if (handleKey === 'insertLink') {
        HyperlinkToolbar.show({vnodes_l: [], vnodes_m: [], vnodes_r: []} ,this.#CurrentNode)
      } else {
        const newNodeConfig =  await this.#getNodeOptionsByHandleKey(handleKey)
        if (!newNodeConfig) return
        const newNode = new Node(newNodeConfig, this.#CurrentNode.$editor)
        newNode.insertAfter(this.#CurrentNode)
      }
      this.#destroy()
    })
  }

  async #getNodeOptionsByHandleKey (key) {
    const $editor = this.#CurrentNode.$editor
    const HandeMap = {
      insertH1: async () => {
        return { type: 'head', content: '', attr: { level: 1 } }
      },
      insertH2: async () => {
        return { type: 'head', content: '', attr: { level: 2 } }
      },
      insertH3: async () => {
        return { type: 'head', content: '', attr: { level: 3 } }
      },
      insertParagraph: async () => {
        return { type: 'paragraph', child: [] }
      },
      insertImage: async () => {
        if ($editor.$uploadImage && typeof $editor.$uploadImage === 'function') {
          const url = await $editor.$uploadImage()
          return { type: 'image', content: '', attr: { url } }
        }
      },
      insertTable: async () => {
        return {
          type: 'table',
          attr: {
            data: [
              ['表头1', '表头2', '表头3', '表头3'],
              ['', '', '', ''],
              ['', '', '', '']
            ]
          }
        }
      }
    }
    return await HandeMap[key]()
  }

  #destroy ($node) {
    if (this.#CurrentNode) {
      this.#CurrentNode.triggerHover(false)
      this.#CurrentNode = null
    }
    this.$el.remove()
  }

  show ($node) {
    clearTimeout(this.#ShowTimmer)
    this.#ShowTimmer = setTimeout(() => {
      this.#create($node)
    }, 500)
  }

  hide ($node) {
    clearTimeout(this.#ShowTimmer)
    // 如果当前显示弹窗不属于该节点，则跳过
    if ($node !== this.#CurrentNode) return
    clearTimeout(this.#HideTimmer)
    this.#HideTimmer = setTimeout(() => {
      this.#destroy($node)
    }, 300)
  }

}

const NodeToolbar = new Toolbar()

export default NodeToolbar