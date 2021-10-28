const _querySelectorAll = (selector) => {
  const elems = document.querySelectorAll(selector)
  return [...elems]
}

const _isDOMList = (selector) => {
  if (!selector) return false
  if (selector instanceof HTMLCollection || selector instanceof NodeList) return true
  return false
}

const _createElemByHtml = (html) => {
  let div
  div = document.createElement('div')
  div.innerHTML = html
  return div.children
}

class DomElement {
  
  nodeList = []
  
  constructor(selector) {
    // 如果selector本身就是DomElement，则直接返回
    if (selector instanceof DomElement) {
      return selector
    }
    const nodeType = selector.nodeType

    let selectorResult = []

    // 为元素节点 或者 document 节点时
    if (nodeType === 1 || nodeType === 9) {
      selectorResult = [selector]
    } else if (_isDOMList(selector) || selector instanceof Array) {
      selectorResult = selector
    } else if (typeof selector === 'string') {
      const tmpSelector = selector.replace(/\n/mg, '').trim()
      // 如果是html字符串
      if (tmpSelector.indexOf('<') === 0) {
        selectorResult = [..._createElemByHtml(tmpSelector)]
      } else {
        selectorResult = _querySelectorAll(tmpSelector)
      }
    }

    this.nodeList = selectorResult
  }

  append($children) {
    this.nodeList.forEach(node => {
      $children.nodeList.forEach(_childNode => {
        node.appendChild(_childNode)
      })
    })
  }

  remove() {
    return this.nodeList.forEach(node => {
      if (node.remove) {
        node.remove()
      } else {
        node.parentElement && node.parentElement.removeChild(node)
      }
    })
  }

  isContain($child) {
    const parent = this.nodeList[0]
    const child = $child.nodeList[0]
    return parent.contains(child)
  }

  empty() {
    this.nodeList.forEach(node => {
      node.innerHTML = ''
    })
    return this
  }

  getSizeData() {
    return this.nodeList[0].getBoundingClientRect()
  }

  html(val) {
    const node = this.nodeList[0]
    if (val) {
      node.innerHTML = val
      return this
    } else {
      return node.innerHTML
    }
  }

  addClass(className) {
    if (!className) return this
    this.nodeList.forEach(node => {
      if (node.className) {
        let arr
        // 解析当前 className 转换为数组
        arr = node.className.split(/\s/).filter(item => !!item.trim())
        // 添加 class
        if (!arr.includes(className)) {
          arr.push(className)
        }
        // 修改 node.class
        node.className = arr.join(' ')
      } else {
        node.className = className
      }
    })
  }

  removeClass(className) {
    if (!className) return this
    this.nodeList.forEach(node => {
      if (node.className) {
        let arr = node.className.split(/\s/).filter(item => !!item.trim())
        arr = arr.filter(item => item !== className)
        node.className = arr.join(' ')
      }
    })
  }

  class(className) {
    this.nodeList.forEach(node => {
      if (node.className) {
        node.className = className
      }
    })
  }

  attr (key, val) {
    if (val) {
      this.nodeList.forEach(node => {
        node.setAttribute(key, val)
      })
      return this
    } else {
      return this.nodeList[0].getAttribute(key)
    }
  }

  // 聚焦dom type -1 行尾 1 行首
  focus(type = -1) {
    if (this.nodeList.length === 0) return
    let inputWarpEle = this.nodeList[0]
    let rangeConfig = {
      node: null,
      offset: 0
    }
    if (type == 1) {
      let firstSpan = [...inputWarpEle.childNodes][0]
      let firstNode = [...firstSpan.childNodes][0]
      rangeConfig = {
        node: firstNode,
        offset: 0
      }
    }
    if (type == -1) {
      let lastSpan = [...inputWarpEle.childNodes].slice(-1)[0]
      let lastNode = [...lastSpan.childNodes].slice(-1)[0]
      rangeConfig = {
        node: lastNode,
        offset: lastNode.textContent.length
      }
    }
    let lastSpan = [...inputWarpEle.childNodes].slice(-1)[0]
    let lastNode = [...lastSpan.childNodes].slice(-1)[0]
    const range = new Range()
    range.setStart(rangeConfig.node, rangeConfig.offset)
    range.setEnd(rangeConfig.node, rangeConfig.offset)
    const selection = window.getSelection ? window.getSelection() : document.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)
    this.nodeList[0].focus()
  }

  find(selector) {
    const elem = this.nodeList[0]
    return $(elem.querySelectorAll(selector))
  }

  insertBefore(selector) {
    const $referenceNode = $(selector)
    const referenceNode = $referenceNode.nodeList[0]
    if (!referenceNode) {
      return this
    }
    return this.nodeList.forEach(node => {
      const parent = referenceNode.parentNode
      parent.insertBefore(node, referenceNode)
    })
  }

  insertAfter(selector) {
    const $referenceNode = $(selector)
    const referenceNode = $referenceNode.nodeList[0]
    const anchorNode = referenceNode && referenceNode.nextSibling
    if (!referenceNode) {
      return this
    }
    return this.nodeList.forEach(node => {
      const parent = referenceNode.parentNode
      if (anchorNode) {
        parent.insertBefore(node, anchorNode)
      } else {
        parent.appendChild(node)
      }
    })
  }

  on(type, selector, fn) {
    // selector 不为空，证明绑定事件要加代理
    if (!fn) {
      fn = selector
      selector = null
    }

    // type 是否有多个
    let types = []
    types = type.split(/\s+/)

    return this.nodeList.forEach(node => {
      types.forEach(type => {
        if (!type) {
          return
        }

        // 记录下，方便后面解绑
        // eventList.push({
        //   elem: elem,
        //   type: type,
        //   fn: fn
        // })
        
        // 无代理
        if (!selector) {
          node.addEventListener(type, fn)
          return
        }

        // 有代理
        node.addEventListener(type, e => {
          const target = e.target
          if (target.matches(selector)) {
            fn.call(target, e)
          }
        })
      })
    })
  }

  off(type, fn) {
    return this.nodeList.forEach(node => {
      node.removeEventListener(type, fn)
    })
  }

}

function $(selector) {
  if (!selector) {
    return false
  }
  return new DomElement(selector)
}

export default $