// components/tab-bar/index.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    list:[
        {
            pagePath:"/pages/index/index",
            text:"渲染",
            // iconPath:"/icons/tab-bar/index.png",
            // selectedIconPath:"/icons/tab-bar/index-selected.png"
        },
        {
            pagePath:"/pages/task/index",
            text:"任务列表",
        }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})