# awesome-editor
Cross platform editor


```
[
  {
    "type": 1,            // 标题节点
    "content": "标题",
    "attr": {
      "level": 1,         // 标题等级，目前 1、2、3、4、5
      "color": "#dc2d1e", // 字体颜色
      "bgc": "#f8e6ab"    // 字体背景颜色
    }
  },
  {
    "type": 2,            // 内容节点，节点本身为容器，本身没有content
    "content": "",
    "child": [
      {
        "type": 21,
        "content": "文本内容",
        "attr": {
          "bold": 1,         // 加粗
          "underline": 1,    // 下划线
          "lineThrough": 1,  // 删除线
          "italic": 1,       // 斜体
          "color": "red"     // 字体颜色(red, yellow, green)
        }
      },
      {
        "type": 22,
        "content": "文本内容",
        "attr": {
          "url": "https://www.baidu.com"
        }
      }
    ]
  }
]
```