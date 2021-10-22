// 行节点-工具栏
class Toolbar {

  $el = null

  #CurrentNode = null

  $timmerId = null

  constructor () {
    
  }

  #initToolbarDom () {

  }

  #create () {
    
  }

  show ($node) {
    clearTimeout(this.$timmerId)
    this.$timmerId = setTimeout(() => {
      console.log('show node-toolbar')
    }, 1000)
  }

  hide ($node) {
    clearTimeout(this.$timmerId)
    this.$timmerId = setTimeout(() => {
      console.log('hide node-toolbar')
    }, 1000)
  }

}

const NodeToolbar = new Toolbar()

export default NodeToolbar