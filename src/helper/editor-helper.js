import $ from '@/util/dom-core'
import {
  selectionFormat
} from '@/helper/selection-helper'

// 获取编辑器内容
export function GetEditorContent ($editor) {
  return $editor.$nodes.map(($node) => {
    const node = {
      type: $node.$type,
      attr: { ...$node.$attr }
    }
    if ($node.$type === 'head') {
      node.content = $node.$el.find('.input-wrap').nodeList[0].textContent
    }
    if ($node.$type === 'paragraph') {
      const { vnodes_l, vnodes_m, vnodes_r } = selectionFormat($node.$el.find('.input-wrap').nodeList[0])
      node.child = [...vnodes_l, ...vnodes_m, ...vnodes_r].map(vnode => {
        return {
          type: vnode.$type,
          content: vnode.$content,
          attr: { ...vnode.$attr }
        }
      })
    }
    if ($node.$type === 'image') {
      // 这里暂时不用处理，image节点暂无替换图片操作
    }
    if ($node.$type === 'table') {
      node.attr.data = [...$node.$el.find('tr').nodeList].map(row => {
        return [...row.childNodes].map(td => $(td).find('input').nodeList[0].value)
      })
    }
    return node
  })
}

// 将富文本内容转化为智库富文本类型
export function Editor2BPY (data) {
  return data.map(node => {
    const newNode = {
      type: '',
      content: node.content || '',
      attribute: {}
    }
    if (node.type === 'image') {
      newNode.attribute = { url: node.attr.url }
    }
    if (node.type === 'table') {
      newNode.attribute = { data: node.attr.data }
    }
    const nodeTypeMap = { head_1: 1, head_2: 2, head_3: 3, paragraph_: 4, image_: 11, table_: 5 }
    newNode.type = nodeTypeMap[`${node.type}_${node.attr?.level || ''}`]
    if (node.child) {
      newNode.next = node.child.map(item => {
        const textTypemap = { text: 10, link: 12 }
        const textNode = {
          type: textTypemap[item.type],
          content: item.content || '',
          attribute: {}
        }
        if (item.attr.bold) {
          textNode.attribute.bold = 1
        }
        if (item.attr.lineThrough) {
          textNode.attribute.delete = 1
        }
        if (item.type === 'link') {
          textNode.attribute.url = item.attr.url
        }
        return textNode
      })
    }
    return newNode
  })
}

// 智库数据格式转化为编辑器通用格式
export function BPY2Editor (data) {
  return data.map(node => {
    let newNode = {}
    if (node.type === 1) {
      newNode = {
        type: 'head',
        content: node.content || '',
        attr: { level: 1 }
      }
    }
    if (node.type === 2) {
      newNode = {
        type: 'head',
        content: node.content || '',
        attr: { level: 2 }
      }
    }
    if (node.type === 3) {
      newNode = {
        type: 'head',
        content: node.content || '',
        attr: { level: 3 }
      }
    }
    if (node.type === 4) {
      newNode = {
        type: 'paragraph',
        child: node.next.map(item => {
          const textTypeMap = { 10: 'text', 12: 'link' }
          let textNode = {
            type: textTypeMap[item.type],
            content: item.content || '',
            attr: {}
          }
          if (item.attribute?.bold) {
            textNode.attr.bold = 1
          }
          if (item.attribute?.delete) {
            textNode.attr.lineThrough = 1
          }
          if (item.attribute?.url) {
            textNode.attr.url = item.attribute.url
          }
          return textNode
        })
      }
    }
    if (node.type === 11) {
      newNode = {
        type: 'image',
        content: '',
        attr: { url: node.attribute.url }
      }
    }
    if (node.type === 5) {
      newNode = {
        type: 'table',
        content: '',
        attr: {
          data: node.attribute.data
        }
      }
    }
    return newNode
  })
}