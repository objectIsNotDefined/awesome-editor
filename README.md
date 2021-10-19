# awesome-editor
Cross platform editor


```
[
  {
    "type": "head",     // 标题节点
    "attr": {
      "level": 1        // 标题等级 1、2、3
    },
    content: "一级标题"
  },
  {
    "type": "head",
    "attr": {
      "level": 2
    },
    "content": "二级标题"
  },
  {
    "type": "head",
    "attr": {
      "level": 3
    },
    "content": "三级标题"
  },
  {
    "type": "paragraph",      // 文本段落
    "child": [
      {
        "type": "text",
        "attr": {
          "bold": 1,         // 加粗
          "underline": 1,    // 下划线
          "lineThrough": 1,  // 删除线
          "italic": 1,       // 斜体
          "color": "red"     // 字体颜色(red, yellow, green)
        },
        "content": "文本内容"
      },
      {
        "type": "link",
        "attr": {
          "url": "https://zhiku.bopuyun.com"
        },
        "content": "博普智库"
      }
    ]
  }
]
```