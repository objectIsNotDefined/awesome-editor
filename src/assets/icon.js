import '@/assets/icons/icon-add.svg'
import '@/assets/icons/icon-delete.svg'
import '@/assets/icons/icon-editor-b.svg'
import '@/assets/icons/icon-editor-h-1.svg'
import '@/assets/icons/icon-editor-h-2.svg'
import '@/assets/icons/icon-editor-h-3.svg'
import '@/assets/icons/icon-editor-i.svg'
import '@/assets/icons/icon-editor-img.svg'
import '@/assets/icons/icon-editor-link.svg'
import '@/assets/icons/icon-editor-p.svg'
import '@/assets/icons/icon-editor-s.svg'
import '@/assets/icons/icon-editor-table.svg'
import '@/assets/icons/icon-editor-u.svg'

const getIcon = (id) => {
  return `<svg>
    <use xlink:href="#${id}"></use>
  </svg>`
}

export default {
  Add:    getIcon('icon-add'),
  Delete: getIcon('icon-delete'),
  B:      getIcon('icon-editor-b'),
  H1:     getIcon('icon-editor-h-1'),
  H2:     getIcon('icon-editor-h-2'),
  H3:     getIcon('icon-editor-h-3'),
  I:      getIcon('icon-editor-i'),
  Img:    getIcon('icon-editor-img'),
  Link:   getIcon('icon-editor-link'),
  P:      getIcon('icon-editor-p'),
  S:      getIcon('icon-editor-s'),
  Table:  getIcon('icon-editor-table'),
  U:      getIcon('icon-editor-u')
}