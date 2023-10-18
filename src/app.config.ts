export default defineAppConfig({
  tabBar: {
    color: "#333",
    selectedColor: "#3963BC",
    backgroundColor: "#FFF",
    list: [
      {
        pagePath: "pages/home/index",
        text: "Home",
        iconPath: "assets/images/tabbar/draw.png",
        selectedIconPath: "assets/images/tabbar/drawselect.png",
      },
      {
        pagePath: "pages/index/index",
        text: "渲染",
        iconPath: "assets/images/tabbar/draw.png",
        selectedIconPath: "assets/images/tabbar/drawselect.png",
      },
      {
        pagePath: "pages/task/index",
        text: "任务列表",
        iconPath: "assets/images/tabbar/task.png",
        selectedIconPath: "assets/images/tabbar/taskselect.png",
      },
      {
        pagePath: "pages/user/index",
        text: "福利",
        iconPath: "assets/images/tabbar/task.png",
        selectedIconPath: "assets/images/tabbar/taskselect.png",
      },
    ],
  },
  pages: [
    "pages/home/index",
    "pages/index/index",
    "pages/task/index",
    "pages/user/index",
    "pages/qrcode/index"
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
  },
});
