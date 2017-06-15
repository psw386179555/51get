// pages/moneydetail/moneydetail.js
var Zan = require('../../style/dist/index');

Page(Object.assign({}, Zan.Tab, {
  data:{
     showContainer:'all',
    tab: {
      list: [{
        id: 'all',
        title: '消费明细'
      }, {
        id: 'topay',
        title: '充值明细'
      }],
      selectedId: 'all',
      scroll: false,     
    },
    changeMoneyDetail:[
    {
      id:1,
      title:"微信支付20元",
      time:"2017-05-14 20:30:20",
      money:"+20.00"
    },
    {
      id:3,
      title:"微信支付30元",
      time:"2017-05-14 21:30:20",
      money:"+30.00"
    }
    ],
    saleMoneyDetail:[
    {
      id:5,
      title:"行程消费",
      time:"2017-05-14 20:30:20",
      money:"-20.00"
    },
    {
      id:6,
      title:"行程消费",
      time:"2017-05-14 21:30:20",
      money:"-30.00"
    }
    ]
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  handleZanTabChange(e) {
    var componentId = e.componentId;
    var selectedId = e.selectedId;
    var that=this;
    this.setData({
      [`${componentId}.selectedId`]: selectedId,
      showContainer:e.selectedId
    });
  },
}));