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
    const { type } = event.currentTarget.dataset;
    // console.log(event);
    const { isCombined } = this.data.loanParams;

    if (isCombined) {
      const { fundMoney, fundRates, commercialMoney, commercialRates, months } = this.data.loanParams;
      const fundResult = this.calcLoan({ money: fundMoney, rates: fundRates, months, type });
      const commercialResult = this.calcLoan({ money: commercialMoney, rates: commercialRates, months, type });

      this.setData({
        'detail.monthlyRepayment': (fundResult.monthlyRepayment + commercialResult.monthlyRepayment).toFixed(2),
        'detail.totalRepayment': ((fundResult.totalRepayment + commercialResult.totalRepayment) / 10000).toFixed(2),
        'detail.totalLoan': (fundResult.totalLoan + commercialResult.totalLoan).toFixed(2),
        'detail.totalInterest': ((fundResult.totalInterest + commercialResult.totalInterest) / 10000).toFixed(2),
      });
    } else {
      const { money, rates, months } = this.data.loanParams;
      const result = this.calcLoan({ money, rates, months, type });
      this.setData({
        'detail.monthlyRepayment': result.monthlyRepayment.toFixed(2),
        'detail.totalRepayment': (result.totalRepayment / 10000).toFixed(2),
        'detail.totalLoan': result.totalLoan.toFixed(2),
        'detail.totalInterest': (result.totalInterest / 10000).toFixed(2),
      });
    }

    this.setData({
      activeType: event.currentTarget.dataset.type,
    });
  },

  onRecalculate: function () {
    wx.navigateBack();
  },

  onRepaymentDetail: function () {
    const type = this.data.activeType;
    const that = this

    wx.navigateTo({
      url: '/pages/mortgage/list/index',
      events: {},
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('transLoanListParams', { ...that.data.loanParams, type });
      },
      fail: function () {},
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel();
    const that = this;
    // 监听transLoanDetailParams事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('transLoanDetailParams', function ({ data, isCombined = false }) {
      console.log({ data, isCombined });
      if (isCombined) {
        const { fundMoney, fundRates, commercialMoney, commercialRates, months, type } = data;
        console.log({ fundMoney, fundRates, commercialMoney, commercialRates, months, type });
        that.setData({
          activeType: type,
          loanParams: { isCombined, fundMoney, fundRates, commercialMoney, commercialRates, months },
        });

        const fundResult = that.calcLoan({ money: fundMoney, rates: fundRates, months, type });
        const commercialResult = that.calcLoan({ money: commercialMoney, rates: commercialRates, months, type });

        that.setData({
          'detail.monthlyRepayment': (fundResult.monthlyRepayment + commercialResult.monthlyRepayment).toFixed(2),
          'detail.totalRepayment': ((fundResult.totalRepayment + commercialResult.totalRepayment) / 10000).toFixed(2),
          'detail.totalLoan': (fundResult.totalLoan + commercialResult.totalLoan).toFixed(2),
          'detail.totalInterest': ((fundResult.totalInterest + commercialResult.totalInterest) / 10000).toFixed(2),
        });
      } else {
        const { money, rates, months, type } = data;
        that.setData({
          activeType: type,
          loanParams: { isCombined, money, rates, months },
        });
        const result = that.calcLoan({ money, rates, months, type });
        that.setData({
          'detail.monthlyRepayment': result.monthlyRepayment.toFixed(2),
          'detail.totalRepayment': (result.totalRepayment / 10000).toFixed(2),
          'detail.totalLoan': result.totalLoan.toFixed(2),
          'detail.totalInterest': (result.totalInterest / 10000).toFixed(2),
        });
      }
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
   * @returns {object} { totalLoan, monthlyRepayment, totalInterest, totalRepayment}
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
    return result;
  },
});
