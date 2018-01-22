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

var startMonth = new Date().Format("yyyy-MM") + "-01 00:00:00"; //月初
var startDay = new Date().Format("yyyy-MM-dd") + " 00:00:00";//今天开始
var endDate = new Date().Format("yyyy-MM-dd HH:mm:ss");//当前时间

$(function() {

    var initData = function (startDate, endDate) {
        //订单数
        $.get("order/sumOrder",{startDate:startDate, endDate:endDate},function (result) {
            if(result.code == "0000" && result.data != null) {
                //{"SUM":35877}
                $("#sumOrder").text(result.data.SUM);
            }
        });
        //仓库数量
        $.get("houseware/sumHouseWareVehicle",{startDate:startDate, endDate:endDate},function (result) {
            if(result.code == "0000" && result.data != null) {
                //{"WSY":826}
                $("#sumHouseWareVehicle").text(result.data.WSY);
            }
        });
        //调度车辆数
        $.get("vehicle/sumDispatchVehicle",{startDate:startDate, endDate:endDate},function (result) {
            if(result.code == "0000" && result.data != null) {
                //{"ZH":254}
                $("#sumDispatchVehicle").text(result.data.ZH);
            }
        });
       /* //结算金额
        $.get("balance/sumBalance",{startDate:startDate, endDate:endDate},function (result) {
            if(result.code == "0000") {
                //{"SUM":46789994.2538}
                $("#sumBalance").text(result.data == null ? 0 : result.data.SUM.toFixed(2));
            }
        });
        //车辆公里数
        $.get("vehicle/sumVehicleKm",{startDate:startDate, endDate:endDate},function (result) {
            if(result.code == "0000") {
                //{"ZH":55088157}
                $("#sumVehicleKm").text(result.data == null ? 0 : result.data.ZH);
            }
        });*/
        //入库数量
        $.get("houseware/intHouseWareVehicle",{startDate:startDate, endDate:endDate},function (result) {
            if(result.code == "0000" && result.data != null) {
                //{"COUNT":10608}
                $("#intHouseWareVehicle").text(result.data.COUNT);
            }
        });
        //出库数量
        $.get("houseware/outHouseWareVehicle",{startDate:startDate, endDate:endDate},function (result) {
            if(result.code == "0000" && result.data != null) {
                //{"COUNT":11294}
                $("#outHouseWareVehicle").text(result.data.COUNT);
            }
        });


        //订单完成率
        finishRate.showLoading({
            text: '加载中...', textColor: '#fff', maskColor: 'rgba(0, 0, 0, 0.1)'
        });
        $.get("order/sumOrderStatus",{startDate:startDate, endDate:endDate},function (result) {
            finishRate.hideLoading();
            if(result.code == "0000" && result.data != null) {
                //  [{TITLE: "未完成", ZH: 0}, {TITLE: "已完成", ZH: 0}]
                var data = result.data;
                for(var i = 0, size = data.length; i < size; i++) {
                    if(data[i].TITLE == '已完成') {
                        finishRateOpt.series[0].data[0].value = data[i].ZH;
                    } else if(data[i].TITLE == '未完成') {
                        finishRateOpt.series[0].data[1].value = data[i].ZH;
                    }
                }
                finishRate.setOption(finishRateOpt);
            }
        });

        //已完成订单车辆种类
        finished.showLoading({
            text: '加载中...', textColor: '#fff', maskColor: 'rgba(0, 0, 0, 0.1)'
        });
        $.get("order/sumOrderCompleteVehicleType",{startDate:startDate, endDate:endDate},function (result) {
            finished.hideLoading();
            if(result.code == "0000" && result.data != null) {
                //[{"ZH":191},{"VCCARTYPE":"H31:轻型普通货车","ZH":576},{"VCCARTYPE":"H32:轻型厢式货车","ZH":37},{"VCCARTYPE":"K31:小型普通客车","ZH":1565},{"VCCARTYPE":"K21:中型普通客车","ZH":1}]
                var shadowData = [], nameData = [], valueData = [];
                var data = result.data, size = data.length;
                var maxValue = 10;
                for(var i = 0; i < size; i++) {
                    nameData[i] = data[i].VCCARTYPE ? data[i].VCCARTYPE : '其它';
                    valueData[i] = data[i].ZH;
                    maxValue = maxValue > data[i].ZH ? maxValue : data[i].ZH;
                }
                maxValue += 10;
                for(var i = 0; i < size; i++) {
                    shadowData[i] = maxValue;
                }
                finishedOpt.yAxis.data = nameData;
                finishedOpt.series[0].data = shadowData;
                finishedOpt.series[1].data = valueData;
                finished.setOption(finishedOpt);
            }
        });

        //订单来源
        orderSource.showLoading({
            text: '加载中...', textColor: '#fff', maskColor: 'rgba(0, 0, 0, 0.1)'
        });
        $.get("order/sumOrderFrom",{startDate:startDate, endDate:endDate},function (result) {
            orderSource.hideLoading();
            if(result.code == "0000" && result.data != null) {
                //[{"COUNT(*)":2},{"COUNT(*)":1,"VCCUSTNAME":"股份"},{"COUNT(*)":2,"VCCUSTNAME":"新疆瑞福顺隆汽车销售服务有限责任公司"},{"COUNT(*)":9,"VCCUSTNAME":"江西华泽汽车销售有限责任公司jiangxihuaze"},{"COUNT(*)":4,"VCCUSTNAME":"徐汇江铃销售服务有限公司"},{"COUNT(*)":2,"VCCUSTNAME":"新疆全顺江铃汽车销售有限公司"},{"COUNT(*)":1,"VCCUSTNAME":"河南裕华丰汇汽车销售服务有限公司 Henan Yuhuafenghui"}]
                var nameData = [], valueData = [];
                var data = result.data, size = data.length;
                for(var i = 0; i < size; i++) {
                    nameData[i] = data[i].VCCUSTNAME ? data[i].VCCUSTNAME : '其它';
                    valueData[i] = data[i].COUNT;
                }
                orderSourceOpt.xAxis[0].data = nameData;
                orderSourceOpt.series[0].data = valueData;
                orderSource.setOption(orderSourceOpt);
            }
        });

        //车辆总数
        vehicleCount.showLoading({
            text: '加载中...', textColor: '#fff', maskColor: 'rgba(0, 0, 0, 0.1)'
        });
        $.get("vehicle/sumVihicleType",{startDate:startDate, endDate:endDate},function (result) {
            vehicleCount.hideLoading();
            if(result.code == "0000" && result.data != null) {
                //[{"VCLPATTERN":"虚拟","ZH":542},{"ZH":479},{"VCLPATTERN":"无效","ZH":120}]
                var legendData = [];
                var seriesData = [];
                var data = result.data;
                for(var i = 0, size = data.length; i < size; i++) {
                    var name = data[i].VCLPATTERN ? data[i].VCLPATTERN : '其它';
                    legendData[i] = {'icon': 'circle', 'name': name};
                    seriesData[i] = {'name': name, 'value': data[i].ZH};
                }
                vehicleCountOpt.legend.data = legendData;
                vehicleCountOpt.series[0].data = seriesData;
                vehicleCount.setOption(vehicleCountOpt);
            }
        });

        //运输车辆数
        vehicleUsed.showLoading({
            text: '加载中...', textColor: '#fff', maskColor: 'rgba(0, 0, 0, 0.1)'
        });
        $.get("vehicle/sumTransVihicle",{startDate:startDate, endDate:endDate},function (result) {
            vehicleUsed.hideLoading();
            if(result.code == "0000" && result.data != null) {
                //[{"TITLE":"发送运输","ZH":0},{"TITLE":"已到达","ZH":0},{"TITLE":"未到达","ZH":21}]
                var legendData = [];
                var seriesData = [];
                var data = result.data;
                for(var i = 0, size = data.length; i < size; i++) {
                    var name = data[i].TITLE ? data[i].TITLE : '其它';
                    legendData[i] = {'icon': 'circle', 'name': name};
                    seriesData[i] = {'name': name, 'value': data[i].ZH};
                }
                vehicleUsedOpt.legend.data = legendData;
                vehicleUsedOpt.series[0].data = seriesData;
                vehicleUsed.setOption(vehicleUsedOpt);
            }
        });

        //调度车辆数
        vehicleDispatch.showLoading({
            text: '加载中...', textColor: '#fff', maskColor: 'rgba(0, 0, 0, 0.1)'
        });
        $.get("vehicle/sumDispatchVihicle",{startDate:startDate, endDate:endDate},function (result) {
            vehicleDispatch.hideLoading();
            if(result.code == "0000" && result.data != null) {
                //[{"ZH":3},{"VCTRANSNAME":"零公里","ZH":4},{"VCTRANSNAME":"自提","ZH":9},{"VCTRANSNAME":"人送","ZH":5}]
                var shadowData = [], nameData = [], valueData = [];
                var data = result.data, size = data.length;
                var maxValue = 10;
                for(var i = 0; i < size; i++) {
                    nameData[i] = data[i].VCTRANSNAME ? data[i].VCTRANSNAME : '其它';
                    valueData[i] = data[i].ZH;
                    maxValue = maxValue > data[i].ZH ? maxValue : data[i].ZH;
                }
                maxValue += 10;
                for(var i = 0; i < size; i++) {
                    shadowData[i] = maxValue;
                }
                vehicleDispatchOpt.yAxis.data = nameData;
                vehicleDispatchOpt.series[0].data = shadowData;
                vehicleDispatchOpt.series[1].data = valueData;
                vehicleDispatch.setOption(vehicleDispatchOpt);
            }
        });

        //仓库使用率
        houseWareRate.showLoading({
            text: '加载中...', textColor: '#fff', maskColor: 'rgba(0, 0, 0, 0.1)'
        });
        $.get("houseware/outHouseWareUsed",{startDate:startDate, endDate:endDate},function (result) {
            houseWareRate.hideLoading();
            if(result.code == "0000" && result.data != null) {
                //{"WSY":811,"YSY":826}
                houseWareRateOpt.series[0].data[0].value = result.data.YSY;
                houseWareRateOpt.series[0].data[1].value = result.data.WSY;
                houseWareRate.setOption(houseWareRateOpt);
            }
        });

        //注册司机数
        driverCount.showLoading({
            text: '加载中...', textColor: '#fff', maskColor: 'rgba(0, 0, 0, 0.1)'
        });
        $.get("driver/sumDriverType",{startDate:startDate, endDate:endDate},function (result) {
            driverCount.hideLoading();
            if(result.code == "0000" && result.data != null) {
                //[{"TYPE":"签约人送","ZH":811},{"TYPE":"零公里运输","ZH":1188},{"TYPE":"虚拟人送","ZH":2961}]
                var legendData = [];
                var seriesData = [];
                var data = result.data;
                for(var i = 0, size = data.length; i < size; i++) {
                    var name = data[i].TYPE ? data[i].TYPE : '其它';
                    legendData[i] = {'icon': 'circle', 'name': name};
                    seriesData[i] = {'name': name, 'value': data[i].ZH};
                }
                driverCountOpt.legend.data = legendData;
                driverCountOpt.series[0].data = seriesData;
                driverCount.setOption(driverCountOpt);
            }
        });

        //仓库车型
        vehicleModel.showLoading({
            text: '加载中...', textColor: '#fff', maskColor: 'rgba(0, 0, 0, 0.1)'
        });
        $.get("houseware/outHouseWareVehicleType",{startDate:startDate, endDate:endDate},function (result) {
            vehicleModel.hideLoading();
            if(result.code == "0000" && result.data != null) {
                //[{"ZH":1631},{"VCCARTYPE":"H31:轻型普通货车","ZH":3},{"VCCARTYPE":"K31:小型普通客车","ZH":3}]
                var shadowData = [], nameData = [], valueData = [];
                var data = result.data, size = data.length;
                var maxValue = 10;
                for(var i = 0; i < size; i++) {
                    nameData[i] = data[i].VCCARTYPE ? data[i].VCCARTYPE : '其它';
                    valueData[i] = data[i].ZH;
                    maxValue = maxValue > data[i].ZH ? maxValue : data[i].ZH;
                }
                maxValue += 10;
                for(var i = 0; i < size; i++) {
                    shadowData[i] = maxValue;
                }
                vehicleModelOpt.yAxis.data = nameData;
                vehicleModelOpt.series[0].data = shadowData;
                vehicleModelOpt.series[1].data = valueData;
                vehicleModel.setOption(vehicleModelOpt);
            }
        });

        /*//预警订单查询
        var htmlTitle =
            '<div class="_border_rows">' +
                '<div class="_border_rows_td td1">订单号</div>' +
                '<div class="_border_rows_td td2">订单时间</div>' +
                '<div class="_border_rows_td td3">司机</div>' +
                '<div class="_border_rows_td td4">完成时间</div>' +
                '<div class="_border_rows_td td5">仓库</div>' +
                '<div class="_border_rows_td td6">供应商</div>' +
            '</div>';
        $('#orderData').empty();
        $('#orderData').append(htmlTitle);
        $.get("order/sumWarnOrder",{startDate:startDate, endDate:endDate},function (result) {
            var htmlContent = '';
            var data = result.data;
            for(var i = 0, size = data.length; i < size; i++) {
                htmlContent +=
                    '<div class="_border_rows">' +
                        '<div class="_border_rows_td td1">' + data[i].orderNo + '</div>' +
                        '<div class="_border_rows_td td2">' + data[i].ordertime + '</div>' +
                        '<div class="_border_rows_td td3">' + data[i].contant + '</div>' +
                        '<div class="_border_rows_td td4">' + data[i].ctime + '</div>' +
                        '<div class="_border_rows_td td5">' + data[i].ware + '</div>' +
                        '<div class="_border_rows_td td6" style="overflow: auto;text-overflow: ellipsis;" title="' + data[i].gys + '">' + data[i].gys + '</div>' +
                    '</div>';
            }
            $('#orderData').append(htmlContent);
        });*/
    };

    var echartsInit = function (id) {
        return echarts.init(document.getElementById(id), 'customed');
    };

    var finishRate = echartsInit('finishRate');
    var finished = echartsInit("finished");
    var orderSource = echartsInit("orderSource");
    var vehicleCount = echartsInit("vehicleCount");
    var vehicleUsed = echartsInit("vehicleUsed");
    var vehicleDispatch = echartsInit("vehicleDispatch");
    var houseWareRate = echartsInit("houseWareRate");
    var driverCount = echartsInit("driverCount");
    var vehicleModel = echartsInit("vehicleModel");
    var flag = 'MONTH';
    //订单完成率
    var finishRateOpt = {
        title: {
            text: '订单完成率',
            left: 'left',
            textStyle: {
                fontSize: 15
            }
        },
        tooltip: {
            trigger: 'item',
            position: ['50%', '50%'],
            formatter: "{a} <br/>{b} : {c}"
        },
        legend: {
            bottom: 'bottom',
            left: 'center',
            textStyle: {
                fontSize:11,
            },
            data: [{name:'已完成',icon: 'circle'},{name:'未完成',icon: 'circle'}]
        },
        series: [{
            name: '完成量',
            type: 'pie',
            radius: ['40%', '70%'],
            label: {
                normal: {
                    position: 'center'
                }
            },
            data: [{
                name: '已完成',
                label: {
                    normal: {
                        formatter: '{d}%',
                        textStyle: {
                            fontSize: 15
                        }
                    }
                }
            },{
                name: '未完成',
                label: {
                    normal: {
                        formatter: '\n{d}%',
                        textStyle: {
                            fontSize: 12
                        }
                    }
                }
            }]
        }]
    };
    //已完成订单车辆种类
    var finishedOpt = {
        title: {
            text: '已完成订单车辆种类',
            left: 'left',
            textStyle: {
                fontSize: 15,
            }
        },
        tooltip: {
        },
        grid: {
            left: 'left',
            right: '10%',
            bottom: 5,
            containLabel: true
        },
        xAxis: {
            show:false
        },
        yAxis: {
            type: 'category',
            axisLabel: {
                textStyle: {
                    fontSize: 12
                }
            },
            data: []
        },
        series: [{// For shadow
            type: 'bar',
            itemStyle: {
                normal: {
                    color: 'rgba(23,47,93,0.05)',
                    borderColor:'#1C4070',
                    borderWidth:1
                }
            },
            barGap:'-100%',
            barCategoryGap:10,
            data: [],
            animation: false
        },{
            type: 'bar',
            itemStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                            {offset: 0, color: '#83bff6'},
                            {offset: 0.5, color: '#188df0'},
                            {offset: 1, color: '#188df0'}
                        ]
                    )
                }
            },
            label: {
                normal: {
                    show: true,
                    position: 'right',
                    color:'#28D1A2'
                }
            },
            data: []
        }]
    };
    //订单来源
    var orderSourceOpt = {
        title: {
            text: '订单来源',
            left: 'left',
            textStyle: {
                fontSize: 15,
            }
        },
        tooltip: {
        },
        legend: {
            left: 'right',
            top: 'top',
            textStyle: {
                fontSize:11,
            },
            data: [flag == 'DAY' ? '今日' : '本月']
        },
        xAxis : [
            {
                type : 'category',
                axisLabel: {
                    textStyle: {
                        fontSize: 12
                    },
                },
                data : []
            }
        ],
        yAxis : [
            {
                axisLabel: {
                    show:true,
                    textStyle: {
                        fontSize: 12
                    }
                },
                splitLine : {
                    show :false
                },
                type : 'value'
            }
        ],
        series : [
            {
                name:flag == 'DAY' ? '今日' : '本月',
                type:'bar',
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: '#50B4D9'},
                                {offset: 0.5, color: '#1B5DD8'},
                                {offset: 1, color: '#3C2DD0'}
                            ]
                        )
                    }
                },
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        color: '#28D1A2'
                    }
                },
                data:[]
            }
        ]
    };
    //车辆总数
    var vehicleCountOpt = {
        title: {
            text: '车辆总数',
            left: 'left',
            textStyle: {
                fontSize: 15
            }
        },
        legend: {
            type:'scroll',
            bottom: 'bottom',
            left: 'center',
            textStyle: {
                fontSize:11
            },
            data: []
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c}"
        },
        series : [
            {
                name:'车辆数',
                type:'pie',
                radius : '55%',
                center: ['50%', '50%'],
                data:[],
                roseType: 'radius',
                label: {
                    normal: {
                        formatter:'{c}'
                    }
                },
                labelLine: {
                    normal: {
                        length: 8,
                        length2: 6
                    }
                },
                animationType: 'scale',
                animationEasing: 'elasticOut',
                animationDelay: function (idx) {
                    return Math.random() * 200;
                }
            }
        ]
    };
    //运输车辆数
    var vehicleUsedOpt = {
        title: {
            text: '运输车辆数',
            left: 'left',
            textStyle: {
                fontSize: 15,
            }
        },
        legend: {
            type:'scroll',
            bottom: 'bottom',
            left: 'center',
            textStyle: {
                fontSize:11,
            },
            data: []
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c}"
        },
        series : [
            {
                name:'车辆数',
                type:'pie',
                radius : '55%',
                center: ['50%', '50%'],
                data:[],
                roseType: 'radius',
                label: {
                    normal: {
                        formatter:'{c}'
                    }
                },
                labelLine: {
                    normal: {
                        length: 8,
                        length2: 6
                    }
                },
                animationType: 'scale',
                animationEasing: 'elasticOut',
                animationDelay: function (idx) {
                    return Math.random() * 200;
                }
            }
        ]
    };
    //调度车辆数
    var vehicleDispatchOpt = {
        title: {
            text: '调度车辆数',
            left: 'left',
            textStyle: {
                fontSize: 15,
            }
        },
        legend: {
            left: 'right',
            top: 'top',
            textStyle: {
                fontSize:11,
            },
            data: [flag == 'DAY' ? '今日' : '本月']
        },
        tooltip: {
        },
        grid: {
            left: 'left',
            right: '10%',
            bottom: 5,
            containLabel: true
        },
        xAxis: {
            show:false
        },
        yAxis: {
            type: 'category',
            axisLabel: {
                textStyle: {
                    fontSize: 12
                },
            },
            data: []
        },
        series: [
            {// For shadow
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: 'rgba(23,47,93,0.05)',
                        borderColor:'#1C4070',
                        borderWidth:1
                    }
                },
                barGap:'-100%',
                barCategoryGap:10,
                data: [],
                animation: false
            },{
                name:flag == 'DAY' ? '今日' : '本月',
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: '#83bff6'},
                                {offset: 0.5, color: '#188df0'},
                                {offset: 1, color: '#188df0'}
                            ]
                        )
                    }
                },
                label: {
                    normal: {
                        show: true,
                        position: 'right',
                        color:'#28D1A2'
                    }
                },
                data: []

            }
        ]
    };
    //仓库使用率
    var houseWareRateOpt = {
        title: {
            text: '仓库使用率',
            left: 'left',
            textStyle: {
                fontSize: 15,
            }
        },
        tooltip: {
            trigger: 'item',
            position: ['50%', '50%'],
            formatter: "{a} <br/>{b} : {c}"
        },
        legend: {
            bottom: 'bottom',
            left: 'center',
            textStyle: {
                fontSize:11,
            },
            data: [{name:'已使用',icon: 'circle'},{name:'未使用',icon: 'circle'}]
        },
        series: [{
            name: '使用量',
            type: 'pie',
            radius: ['35%', '65%'],
            label: {
                normal: {
                    position: 'center'
                }
            },
            data: [{
                name: '已使用',
                label: {
                    normal: {
                        formatter: '{d}%',
                        textStyle: {
                            fontSize: 15
                        }
                    }
                }
            },{
                name: '未使用',
                label: {
                    normal: {
                        formatter: '\n{d}%',
                        textStyle: {
                            fontSize: 12
                        }
                    }
                }
            }]
        }]
    };
    //注册司机数
    var driverCountOpt = {
        title: {
            text: '注册司机数',
            left: 'left',
            textStyle: {
                fontSize: 15,
            }
        },
        legend: {
            type:'scroll',
            bottom: 'bottom',
            left: 'center',
            textStyle: {
                fontSize:11,
            },
            data: []
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c}"
        },
        series : [
            {
                name:'司机数',
                type:'pie',
                radius : '55%',
                center: ['50%', '50%'],
                data:[],
                roseType: 'radius',
                label: {
                    normal: {
                        formatter:'{c}'
                    }
                },
                labelLine: {
                    normal: {
                        length: 8,
                        length2: 6
                    }
                },
                animationType: 'scale',
                animationEasing: 'elasticOut',
                animationDelay: function (idx) {
                    return Math.random() * 200;
                }
            }
        ]
    };
    //仓库车型
    var vehicleModelOpt = {
        title: {
            text: '仓库车型',
            left: 'left',
            textStyle: {
                fontSize: 15
            }
        },
        legend: {
            left: 'right',
            top: 'top',
            textStyle: {
                fontSize:11
            },
            data: [flag == 'DAY' ? '今日' : '本月']
        },
        tooltip: {
        },
        grid: {
            left: 'left',
            right: '10%',
            bottom: 5,
            containLabel: true
        },
        xAxis: {
            axisLine: {
                show: true,
                lineStyle: {
                    color:'#0F3360'
                }
            },
            axisLabel: {
                textStyle: {
                    color: '#2872A6',
                    fontSize: 12
                }
            },
            splitLine : {
                show :false
            }
        },
        yAxis: {
            type: 'category',
            axisLabel: {
                textStyle: {
                    color: '#2872A6',
                    fontSize: 12
                },
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color:'#0F3360'
                }
            },
            data: []
        },
        series: [
            {// For shadow
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: 'rgba(23,47,93,0.05)',
                        borderColor:'#1C4070',
                        borderWidth:1
                    }
                },
                barGap:'-100%',
                barCategoryGap:10,
                data: [],
                animation: false
            },{
                name:flag == 'DAY' ? '今日' : '本月',
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: '#83bff6'},
                                {offset: 0.5, color: '#188df0'},
                                {offset: 1, color: '#188df0'}
                            ]
                        )
                    }
                },
                label: {
                    normal: {
                        show: true,
                        position: 'right',
                        color:'#28D1A2'
                    }
                },
                data: []
            }
        ]
    };

    finishRate.setOption(finishRateOpt);
    finished.setOption(finishedOpt);
    orderSource.setOption(orderSourceOpt);
    vehicleCount.setOption(vehicleCountOpt);
    vehicleUsed.setOption(vehicleUsedOpt);
    vehicleDispatch.setOption(vehicleDispatchOpt);
    houseWareRate.setOption(houseWareRateOpt);
    driverCount.setOption(driverCountOpt);
    vehicleModel.setOption(vehicleModelOpt);

    initData(startMonth, endDate);

    $('#_today_button').click(function () {
        if(!$(this).hasClass("selected")) {
            $(this).addClass("selected");
            $('#_month_button').removeClass("selected");
            initData(startDay, endDate);
            flag = 'DAY';
        }
    });
    $('#_month_button').click(function () {
        if(!$(this).hasClass("selected")) {
            $(this).addClass("selected");
            $('#_today_button').removeClass("selected");
            initData(startMonth, endDate);
            flag = 'MONTH';
        }
    });



});