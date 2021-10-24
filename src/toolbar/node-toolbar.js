import $ from '@/util/dom-core'
import Node from '@/node'

// 行节点-工具栏
class Toolbar {

  $el = null

  // 当前弹窗所属node
  #CurrentNode = null

  // 计时器
  #HideTimmer = null

  #ShowTimmer = null

  #Fns = [
    { title: '插入标题', fn: 'insertHead' },
    { title: '插入段落', fn: 'insertParagraph' },
    { title: '插入图片', fn: 'insertImage' },
    { title: '插入表格', fn: 'insertTable' }
  ]

  constructor () {
    
  }

  #initToolbarDom () {

  }

  #create ($node) {
    this.#CurrentNode = $node
    this.#CurrentNode.triggerHover(true)
    // 获取工具栏所属位置
    const { left, top, right, bottom } = $node.$el.find('.bullet-wrapper').nodeList[0].getBoundingClientRect()
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const wrapper = document.createElement('div')
    const handleItems = this.#Fns.reduce((str, item) => {
      return str += `<div class="insert-node" handle-key="${item.fn}">${item.title}</div>`
    }, '')
    this.$el = $(`<div class="node-toolbar-wrap" style="left: ${left}px; top: ${top + 30}px;">
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
    this.$el.on('click', '.insert-node', (e) => {
      const handleKey = $(e.target).attr('handle-key')
      const newNodeConfig = this.#getNodeOptionsByHandleKey(handleKey)
      const newNode = new Node(newNodeConfig, this.#CurrentNode.$editor)
      newNode.insertAfter(this.#CurrentNode)
    })
  }

  #getNodeOptionsByHandleKey (key) {
    const HandeMap = {
      insertHead () {
        return { type: 'head', content: '', attr: {} }
      },
      insertParagraph () {
        return { type: 'paragraph', child: [] }
      },
      insertImage () {
        return { type: 'image', content: '', attr: { url: 'https://bpy-store.oss-cn-hangzhou.aliyuncs.com/ppc/1d/1d14a90d31fa8946b44836237551d898/%E3%80%90Web_%E8%BD%AE%E6%92%AD%E3%80%91%E5%B7%A5%E5%85%B7%E5%88%86%E4%BA%AB%E6%B4%BB%E5%8A%A8.jpg' } }
      },
      insertTable () {
        return {
          type: 'table', attr: {
            data: [
              ['表头1', '表头2', '表头3'],
              ['', '', ''],
              ['', '', '']
            ]
          }
        }
      }
    }
    return HandeMap[key]()
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
    }, 800)
  }

  hide ($node) {
    clearTimeout(this.#ShowTimmer)
    // 如果当前显示弹窗不属于该节点，则跳过
    if ($node !== this.#CurrentNode) return
    clearTimeout(this.#HideTimmer)
    this.#HideTimmer = setTimeout(() => {
      this.#destroy($node)
    }, 500)
  }

}

const NodeToolbar = new Toolbar()

export default NodeToolbar