// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

//var nowTime=new Date();
//nowTime.setMonth(nowTime.getMonth()-1);
//alert(nowTime.Format("yyyy-MM-dd HH:mm:ss"))//上月当前时间

var startMonth = new Date().Format("yyyyMM") + "01"; //月初
var endDate = new Date().Format("yyyyMMdd");//当前时间

$(function() {

    var initData = function (startDate, endDate) {

        //已完成订单车辆种类
       // finished.showLoading({ text: '加载中...', textColor: '#fff', maskColor: 'rgba(0, 0, 0, 0.1)'  });
        $.get("order/orderStatus",{startDate:startDate, endDate:endDate},function (result) {
           // finished.hideLoading();
            if(result.code == "0000" && result.data != null) {
            //


            }
        });

    };

    var echartsInit = function (id) {
        return echarts.init(document.getElementById(id), 'customed');
    };

   /* var finishRate = echartsInit('finishRate');
    var finished = echartsInit("finished");
    var orderSource = echartsInit("orderSource");
    var vehicleCount = echartsInit("vehicleCount");
    var vehicleUsed = echartsInit("vehicleUsed");
    var vehicleDispatch = echartsInit("vehicleDispatch");
    var houseWareRate = echartsInit("houseWareRate");
    var driverCount = echartsInit("driverCount");
    var vehicleModel = echartsInit("vehicleModel");*/
    //订单完成率
    var finishRateOpt = {};
    //已完成订单车辆种类
    var finishedOpt = {};
    //订单来源
    var orderSourceOpt = {};
    //车辆总数
    var vehicleCountOpt = {};
    //运输车辆数
    var vehicleUsedOpt = {};
    //调度车辆数
    var vehicleDispatchOpt = {};
    //仓库使用率
    var houseWareRateOpt = {};
    //注册司机数
    var driverCountOpt ={};
    //仓库车型
    var vehicleModelOpt = {};

   /* finishRate.setOption(finishRateOpt);
    finished.setOption(finishedOpt);
    orderSource.setOption(orderSourceOpt);
    vehicleCount.setOption(vehicleCountOpt);
    vehicleUsed.setOption(vehicleUsedOpt);
    vehicleDispatch.setOption(vehicleDispatchOpt);
    houseWareRate.setOption(houseWareRateOpt);
    driverCount.setOption(driverCountOpt);
    vehicleModel.setOption(vehicleModelOpt);*/

    initData(startMonth, endDate);




});