const eatList = [
  '麻辣烫',
  '饺子',
  '麻辣香锅',
  '黄焖鸡',
  '炒饭',
  '米线',
  '麦当劳',
  '粥',
  '馄饨',
  '肯德基',
  '螺蛳粉',
  '凉皮',
  '烧烤',
  '寿司',
  '酸辣粉',
  '煲仔饭',
  '西北风',
  '面包',
  '重庆小面',
  '冒菜',
  '炸酱面',
  '沙县',
  '酸菜鱼',
  '煎饼果子',
  '咖啡',
  '火锅',
  '烤冷面',
  '沙县小吃',
  '包子',
  '炸鸡',
  '黄焖鸡米饭',
  '披萨',
  '便当',
  '麻婆豆腐',
  '回锅肉',
  '牛奶',
  '肉夹馍',
  'KFC',
  '小笼包',
  '呷哺呷哺',
  '木桶饭',
  '拉面',
  '石锅拌饭',
  '汉堡王',
  '咖喱饭',
  '猪脚饭',
  '水饺',
  '鱼粉',
  '汉堡',
  '盖浇饭',
];

let timer = null;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    text: '什么',
    list: eatList,
    isFirstTime: true, // 是否第一次选择
    isStart: false, // 选择是否开始
  },

  // 随机选择开始
  onRandomSelectStart: function () {
    this.setData({ isStart: true });
    this.startSelectAnime()
    this.startBackgroundAnime()
  },

  // 随机选择结束
  onRandomSelectEnd: function () {
    clearInterval(timer);
    this.setData({ isStart: false, isFirstTime: false });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(timer);
    timer = null;
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(timer);
    timer = null;
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},

  // 开始文字滚动动画
  startSelectAnime: function() {
    const max = this.data.list.length;
    const min = 0;

    timer = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * (max - min + 1) + min);
      this.setData({
        text: this.data.list[randomIndex],
      });
    }, 80);
  },

  // 开始背景动画
  startBackgroundAnime: function() {}
});
