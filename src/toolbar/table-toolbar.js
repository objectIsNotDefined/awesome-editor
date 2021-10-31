import $ from '@/util/dom-core'

import {
  selectionFormat
} from '@/helper/selection-helper'

import {
  runCmd
} from '@/helper/node-helper'

class Toolbar {

  $el = null

  // 当前操作节点
  #CurrentNode = null

  // 当前光标位置
  #CurrentTD = null

  // 操作项目
  #Fns = [
    { title: '插入行', fn: 'insertRow' },
    { title: '删除行', fn: 'deleteRow' },
    { title: '插入列', fn: 'insertCol' },
    { title: '删除列', fn: 'deleteCol' },
    { title: '删除表格', fn: 'deleteTable' }
  ]

  constructor () {
    document.addEventListener('mouseup', (e) => {
      if (this.$el && !this.#CurrentNode.$el.nodeList[0].contains(e.target) && !this.$el.nodeList[0].contains(e.target)) {
        this.destroy()
      }
    }, true)
  }

  #create () {
    const rangeInfo = this.#CurrentNode.$el.nodeList[0].getBoundingClientRect()
    let pos_x = (rangeInfo.left + rangeInfo.right) / 2
    let pos_y = rangeInfo.bottom + 8
    let arrow = 'up'
    if (rangeInfo.bottom + 8 + 32 > window.innerHeight) {
      pos_y = rangeInfo.top - 32 - 8
      arrow = 'down'
    }
    const handleItems = this.#Fns.map(item => `<span class="handle-item" handle-key="${item.fn}">${item.title}</span>`)
    this.$el = $(`<div class="table-toolbar-wrap ${arrow}" style="left: ${pos_x}px; top: ${pos_y}px;">${handleItems.join('')}</div>`)
    this.#CurrentNode.$editor.$el.append(this.$el)
  }

  #bindEvent () {
    this.$el.on('click', '.handle-item', (e) => {
      const handleKey = $(e.target).attr('handle-key')
      const data = this.#CurrentNode.getTableData()
      const handleMap = {
        insertRow: () => {
          data.splice(this.#CurrentTD.row + 1, 0, data[0].map(item => ''))
          this.#CurrentNode.setTableData(data)
        },
        deleteRow: () => {
          data.splice(this.#CurrentTD.row, 1)
          if (data.length === 0) {
            this.#CurrentNode.remove()
          } else {
            this.#CurrentNode.setTableData(data)
          }
        },
        insertCol: () => {
          data.forEach(row => {
            row.splice(this.#CurrentTD.col + 1, 0, '')
          })
          this.#CurrentNode.setTableData(data)
        },
        deleteCol: () => {
          data.forEach(row => {
            row.splice(this.#CurrentTD.col, 1)
          })
          if (data[0].length === 0) {
            this.#CurrentNode.remove()
          } else {
            this.#CurrentNode.setTableData(data)
          }
        },
        deleteTable: () => {
          this.#CurrentNode.remove()
        }
      }
      handleMap[handleKey]()
      this.destroy()
    })
  }

  show (e, $node) {
    this.#CurrentTD = {
      row: Number(e.target.getAttribute('data-row')),
      col: Number(e.target.getAttribute('data-col'))
    }
    this.destroy()
    this.#CurrentNode = $node
    this.#create()
    this.#bindEvent()
  }

  destroy () {
    this.#CurrentNode = null
    this.$el && this.$el.remove()
    this.$el = null
  }

}

const TableToolbar = new Toolbar()

export default TableToolbar