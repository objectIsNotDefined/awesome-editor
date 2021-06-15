# awesome-editor
Cross platform editor


```
[
	{
		"type": 1,
		"content": "一级标题"
	},
	{
		"type": 2,
		"content": "二级标题"
	},
	{
		"type": 3,
		"content": "三级标题"
	},
	{
		"type": 4,
		"content": "",
		"next": [
			{
				"type": 10,
				"content": "文本内容",
				"attribute": {
          "bold": 1, // 是否加粗
          "delete": 1, // 是否有删除线
          "color": "#dedede" // 字体颜色
        }
			},
      {
				"type": 11,
				"content": "", // 图片
				"attribute": {
          "url": "image url" // 字体颜色
        }
			}
		]
	},
	{
		"type": 5,    // 表格
		"content": "",
		"attribute": {
      "data": [
        ["th_1", "th_2", "th_3"],
        ["td_1-1", "td_1-2", "td_1-3"],
        ["td_2_1", "td_2-2", "td_2-3"]
      ]
    }
	}
]
```