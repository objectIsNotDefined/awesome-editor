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
    "type": 2,            // 内容节点，节点本身为容器，没有content为空
    "content": "",
    "child": [
      {
        "type": 21,
        "content": "文本内容",
        "attribute": {
          "bold": 1,      // 是否加粗
          "delete": 1,    // 是否有删除线
          "color": "#dedede" // 字体颜色
        }
      }
    ]
  }
]
```