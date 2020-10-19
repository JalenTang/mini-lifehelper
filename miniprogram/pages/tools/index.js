// miniprogram/pages/tools/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperList: [
      {
        id: 0,
        type: 'image',
        image: '/images/jtcsm.png',
        url: '/pages/eat/index'
      },
      {
        id: 1,
        type: 'image',
        image: '/images/fdsss.jpg',
        url: '/pages/mortgage/main/index'
      },
    ], 
    iconList: [
      { icon: 'eat', color: 'orange', name: '今天吃什么', url: '/pages/eat/index'  },
      { icon: 'mortgage', color: 'orange', name: '房贷算算算', url: '/pages/mortgage/main/index' },
      { icon: 'questionfill', color: 'orange', name: '待定' },
      { icon: 'questionfill', color: 'orange', name: '待定' },
      { icon: 'questionfill', color: 'orange', name: '待定' },
      { icon: 'questionfill', color: 'orange', name: '待定' },
      { icon: 'questionfill', color: 'orange', name: '待定' },
      { icon: 'questionfill', color: 'orange', name: '待定' },
      { icon: 'questionfill', color: 'orange', name: '待定' }
    ],
    gridCol: 3,
  },

  showMore: function (e) {
    console.log(e);
  },

  onItemClick: function (e) {
    const { item } = e.currentTarget.dataset
    console.log(item);
    if (!item.url) {
      wx.showToast({
        mask: 'true',
        icon: 'none',
        title: '敬请期待'
      })
      return false
    }
    wx.navigateTo({
      url: item.url,
      success: function() {},
      fail: function() {
        console.log('fail');
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})