Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel();
    const that = this;
    // 监听transLoanListParams事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('transLoanListParams', function (data) {
      console.log(data);
      const { money, rates, months, type } = data;
      that.geneLoanList({ money, rates, months, type });
    });
  },

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
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

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

  /**
   * 生成贷款列表
   */
  geneLoanList({ money, rates, months, type }) {
    let list = [];
    console.log({ money, rates, months, type });

    // 等额本息
    if (type === 1) {
      // 每月还款额=贷款本金×[月利率×（1+月利率）^还款月数]÷[（1+月利率）^还款月数-1]
      // 每月应还利息=贷款本金×月利率×〔(1+月利率)^还款月数-(1+月利率)^(还款月序号-1)〕÷〔(1+月利率)^还款月数-1〕
      // 每月应还本金=贷款本金×月利率×(1+月利率)^(还款月序号-1)÷〔(1+月利率)^还款月数-1〕
      list = Array(months).fill(0).map((item, index) => {
        return {
          monthlyRepayment: (money * rates * (1 + rates) ** months) / ((1 + rates) ** months - 1),
          monthlyInterest: (money * rates * ((1 + rates) ** months - (1 + rates) ** index)) / ((1 + rates) ** months - 1),
          monthlyPrincipal: (money * rates * (1 + rates) ** index) / ((1 + rates) ** months - 1),
        };
      });
    }

    // 等额本金
    if (type === 2) {
      // 每月还款额=(贷款本金÷还款月数)+(贷款本金-已归还本金累计额)×月利率
      // 每月应还利息=(贷款本金-已归还本金累计额)×月利率。
      // 每月应还本金=贷款本金÷还款月数
      list = Array(months).fill(0).map((item, index) => {
        return {
          monthlyRepayment: money / months + (money - (money / months) * (index + 1)) * rates,
          monthlyInterest: (money - (money / months) * (index + 1)) * rates,
          monthlyPrincipal: money / months,
        };
      });
    }

    console.log(list);
    this.setData({ list });
  },
});
