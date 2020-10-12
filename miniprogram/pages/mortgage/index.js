// miniprogram/pages/mortgage/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      { type: 1, name: '公积金贷款' },
      { type: 2, name: '商业贷款' },
      { type: 3, name: '组合贷款' },
    ],
    activeTabType: 1,
    loanYearsRange: [
      '1年(12)期',
      '2年(24)期',
      '3年(36)期',
      '4年(48)期',
      '5年(60)期',
      '6年(72)期',
      '7年(84)期',
      '8年(96)期',
      '9年(108)期',
      '10年(120)期',
      '15年(180)期',
      '20年(240)期',
      '25年(300)期',
      '30年(360)期',
    ],
    repaymentMethodsRange: [
      { type: 1, name: '等额本息' },
      { type: 2, name: '等额本金' },
    ],

    // 公积金贷款
    fundLoanMoney: 0,
    fundLoanYearIndex: 0,
    fundLoanRatesRange: [
      { type: 1, name: '基准利率(3.25%)', rates: 0.0325 },
      { type: 2, name: '二套房上浮(3.575%)', rates: 0.03575 },
    ],
    fundLoanRatesIndex: 0,
    fundLoanRepaymentMethodIndex: 0,

    // 商业贷款
    commercialLoanMoney: 0,
    commercialLoanYearIndex: 0,
    commercialLoanRatesRange: [
      { type: 1, name: '85折(4.165%)', rates: 0.04165 },
      { type: 2, name: '9折(4.41%)', rates: 0.0441 },
      { type: 3, name: '95折(4.655%)', rates: 0.04655 },
      { type: 4, name: '基准利率(4.9%)', rates: 0.049 },
      { type: 5, name: '1.05倍(5.145%)', rates: 0.05145 },
      { type: 6, name: '1.1倍(5.39%)', rates: 0.0539 },
      { type: 7, name: '1.15倍(5.635%)', rates: 0.05635 },
      { type: 8, name: '1.2倍(5.88%)', rates: 0.0588 },
    ],
    commercialLoanRatesIndex: 3,
    commercialLoanRepaymentMethodIndex: 0,
  },

  onTabChange(event) {
    console.log(event.currentTarget.dataset);
    this.setData({
      activeTabType: event.currentTarget.dataset.type,
    });
  },

  // 公积金贷款相关
  onFundLoanMoneyChange(event) {
    // console.log(event.detail.value);
    this.setData({
      fundLoanMoney: +event.detail.value,
    });
  },
  onFundLoanYearsChange(event) {
    // console.log(event.detail.value);
    this.setData({
      fundLoanYearIndex: event.detail.value,
    });
  },
  onFundLoanRatesChange(event) {
    // console.log(event.detail.value);
    this.setData({
      fundLoanRatesIndex: event.detail.value,
    });
  },
  onFundLoanRepaymentMethodChange(event) {
    // console.log(event.detail.value);
    this.setData({
      fundLoanRepaymentMethodIndex: event.detail.value,
    });
  },
  onFundLoanCal() {
    console.table({
      金额: this.data.fundLoanMoney,
      年数: this.data.loanYearsRange[this.data.fundLoanYearIndex],
      利率: this.data.fundLoanRatesRange[this.data.fundLoanRatesIndex],
      方式: this.data.repaymentMethodsRange[this.data.fundLoanRepaymentMethodIndex],
    });
  },

  // 商业贷款相关
  onCommercialLoanMoneyChange(event) {
    // console.log(event.detail.value);
    this.setData({
      commercialLoanMoney: +event.detail.value,
    });
  },
  onCommercialLoanYearsChange(event) {
    // console.log(event.detail.value);
    this.setData({
      commercialLoanYearIndex: event.detail.value,
    });
  },
  onCommercialLoanRatesChange(event) {
    // console.log(event.detail.value);
    this.setData({
      commercialLoanRatesIndex: event.detail.value,
    });
  },
  onCommercialLoanRepaymentMethodChange(event) {
    // console.log(event.detail.value);
    this.setData({
      commercialLoanRepaymentMethodIndex: event.detail.value,
    });
  },
  onCommercialLoanCal() {
    const result = this.calLoan({
      money: this.data.commercialLoanMoney * 10000,
      rates: this.data.commercialLoanRatesRange[this.data.commercialLoanRatesIndex].rates / 12,
      months: parseInt(this.data.loanYearsRange[this.data.commercialLoanYearIndex]) * 12,
      type: this.data.repaymentMethodsRange[this.data.commercialLoanRepaymentMethodIndex].type,
    });

    console.log(result.monthlyRepayment);
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
  calLoan({ money, rates, months, type }) {
    console.log({ money, rates, months, type });
    const result = {};
    // 等额本金
    // 每月还款额=贷款本金×[月利率×（1+月利率）^还款月数]÷[（1+月利率）^还款月数-1]
    if (type === 1) {
      result.monthlyRepayment = (money * rates * ((1 + rates) ** months)) / ((1 + rates) ** months - 1);
    }

    // 等额本息
    if (type === 2) {
    }

    return result;
  },
});