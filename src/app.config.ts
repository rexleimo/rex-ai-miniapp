export default defineAppConfig({
  "tabBar": {
    "color": "#333",
    "selectedColor": "#3963BC",
    "backgroundColor": "#FFF",
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "渲染",
        "iconPath": "assets/images/tabbar/draw.png",
        "selectedIconPath": "assets/images/tabbar/drawselect.png"
      },
      {
        "pagePath": "pages/task/index",
        "text": "任务列表",
        "iconPath": "assets/images/tabbar/task.png",
        "selectedIconPath": "assets/images/tabbar/taskselect.png"
      }
    ]
  },
  pages: [
    'pages/index/index',
    'pages/task/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  }
})
