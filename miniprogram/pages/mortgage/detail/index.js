// miniprogram/pages/mortgage/detail.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      { type: 1, name: '等额本息' },
      { type: 2, name: '等额本金' },
    ],
    activeType: 1,
    loanParams: {
      money: 0,
      rates: 0,
      months: 0,
    },
    detail: {
      monthlyRepayment: 0,
      totalRepayment: 0,
      totalLoan: 0,
      totalInterest: 0,
    },
  },

  onTabChange: function (event) {
    // console.log(event);
    const { money, rates, months } = this.data.loanParams;
    this.calcLoan({ money, rates, months, type: event.currentTarget.dataset.type });
    this.setData({
      activeType: event.currentTarget.dataset.type,
    });
  },

  onRecalculate: function () {
    wx.navigateBack();
  },

  onRepaymentDetail: function () {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel();
    const that = this;
    // 监听transLoanParams事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('transLoanParams', function (data) {
      console.log(data);
      const { money, rates, months, type } = data;
      that.setData({
        activeType: type,
        'loanParams.money': money,
        'loanParams.rates': rates,
        'loanParams.months': months,
      });
      that.calcLoan({ money, rates, months, type });
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
   * @description 房贷计算函数
   * @author Jalen Tang<jalen2017@hotmail.com>
   * @date 2020-10-12
   * @param {number} money 贷款金额
   * @param {number} rates 月利率
   * @param {number} months 月期数
   * @param {number} type 还款方式
   */
  calcLoan({ money, rates, months, type }) {
    console.log({ money, rates, months, type });
    const result = {
      totalLoan: money / 10000,
    };
    // 等额本息
    if (type === 1) {
      // 每月还款额=贷款本金×[月利率×（1+月利率）^还款月数]÷[（1+月利率）^还款月数-1]
      // 每月应还利息=贷款本金×月利率×〔(1+月利率)^还款月数-(1+月利率)^(还款月序号-1)〕÷〔(1+月利率)^还款月数-1〕
      // 每月应还本金=贷款本金×月利率×(1+月利率)^(还款月序号-1)÷〔(1+月利率)^还款月数-1〕
      // 总利息=还款月数×每月月供额-贷款本金
      // 总还款=每月还款额*还款月数
      result.monthlyRepayment = (money * rates * (1 + rates) ** months) / ((1 + rates) ** months - 1);
      result.totalInterest = months * result.monthlyRepayment - money;
      result.totalRepayment = result.monthlyRepayment * months;
    }

    // 等额本金
    if (type === 2) {
      // 每月还款额=(贷款本金÷还款月数)+(贷款本金-已归还本金累计额)×月利率
      // 每月应还利息=剩余本金×月利率=(贷款本金-已归还本金累计额)×月利率。
      // 每月应还本金=贷款本金÷还款月数
      // 总利息=（还款月数+1）*贷款额*月利率/2
      // 总还款=本金+总利息
      result.monthlyRepayment = money / months + (money - 0) * rates;
      result.totalInterest = ((months + 1) * money * rates) / 2;
      result.totalRepayment = result.totalInterest + money;
    }

    console.log(result);
    this.setData({
      'detail.monthlyRepayment': result.monthlyRepayment.toFixed(2),
      'detail.totalRepayment': (result.totalRepayment / 10000).toFixed(2),
      'detail.totalLoan': result.totalLoan.toFixed(2),
      'detail.totalInterest': (result.totalInterest / 10000).toFixed(2),
    });
  },
});
