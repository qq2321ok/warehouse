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

var startMonth = new Date().Format("yyyy-MM") + "-01"; //月初
var endDate = new Date().Format("yyyy-MM-dd");//当前时间


$(function () {
    var initData = function () {
        bar1.showLoading({ text: '加载中...', textColor: '#fff', maskColor: 'rgba(0, 0, 0, 0.1)' });
        $.get("/app/view/order/getWarnTableData", function (result) {
            if (result.code == "0000" && result.data != null) {
                var data = result.data;
                var tbodyHtml = "";
                var xData = [];
                var seriesData = [[],[],[],[],[]];
                var k = 0;
                $.each(data, function (key, values) {
                    xData.push(key);
                    var rowData = {"r1":0, "r2":0, "r3":0, "r4":0, "r5":0, "count":0};
                    if (values != null) {
                        for (var i = 0; i < values.length; i++) {
                            rowData.count += values[i].count;
                            if (values[i].name == "rank1") {
                                rowData.r1 = values[i].count;
                                seriesData[0][k] = (values[i].count);
                            } else  if (values[i].name == "rank2") {
                                rowData.r2 = values[i].count;
                                seriesData[1][k] = (values[i].count);
                            } else  if (values[i].name == "rank3") {
                                rowData.r3 = values[i].count;
                                seriesData[2][k] = (values[i].count);
                            } else  if (values[i].name == "rank4") {
                                rowData.r4 = values[i].count;
                                seriesData[3][k] = (values[i].count);
                            } else  if (values[i].name == "rank5") {
                                rowData.r5 = values[i].count;
                                seriesData[4][k] = (values[i].count);
                            }
                        }
                        rowData.rate1 = (100*rowData.r1/rowData.count).toFixed(1) + "%";
                        rowData.rate2 = (100*rowData.r2/rowData.count).toFixed(1) + "%";
                        rowData.rate3 = (100*rowData.r3/rowData.count).toFixed(1) + "%";
                        rowData.rate4 = (100*rowData.r4/rowData.count).toFixed(1) + "%";
                        rowData.rate5 = (100*rowData.r5/rowData.count).toFixed(1) + "%";
                    }
                    tbodyHtml += "<tr><td>"+key+"</td><td>"+rowData.r1+"</td><td>"+rowData.r2+"</td><td>"+rowData.r3+"</td><td>"+rowData.r4+"</td><td>"+rowData.r5+"</td><td>"+
                        rowData.count+"</td><td>"+rowData.rate1+"</td><<td>"+rowData.rate2+"</td><td>"+rowData.rate3+"</td><td>"+rowData.rate4+"</td><td>"+rowData.rate5+"</td></tr>"
                    k++;
                });
                $(".table-data tbody").empty().append(tbodyHtml);


                bar1Opt.xAxis[0].data = xData;
                for(var i = 0 ; i < 5; i++) {
                    bar1Opt.series[i].data = seriesData[i];
                }
                bar1.hideLoading();
                bar1.setOption(bar1Opt);

            }

        });

        //仓库数量
        $.get("/app/view/houseware/sumHouseWareVehicle",{startDate:startMonth, endDate:endDate}, function (result) {
            if(result.code == "0000" && result.data != null) {
                //{"WSY":826}
                $("#sumHouseWareVehicle").text(result.data.WSY);
            }
        });
        //入库数量
        $.get("/app/view/houseware/intHouseWareVehicle",{startDate:startMonth, endDate:endDate}, function (result) {
            if(result.code == "0000" && result.data != null) {
                //{"COUNT":10608}
                $("#intHouseWareVehicle").text(result.data.COUNT);
            }
        });
        //出库数量
        $.get("/app/view/houseware/outHouseWareVehicle",{startDate:startMonth, endDate:endDate}, function (result) {
            if(result.code == "0000" && result.data != null) {
                //{"COUNT":11294}
                $("#outHouseWareVehicle").text(result.data.COUNT);
            }
        });

        //仓库库容比
        gauge.showLoading({  text: '加载中...', textColor: '#fff', maskColor: 'rgba(0, 0, 0, 0.1)' });
        $.get("/app/view/houseware/outHouseWareUsed",{startDate:startMonth, endDate:endDate},function (result) {
            if(result.code == "0000" && result.data != null) {
                //{"WSY":811,"YSY":826}
                var ysy = result.data.YSY;
                var wsy = result.data.WSY;
                gaugeOpt.series[0].data[0].value = (100*wsy/(wsy + ysy)).toFixed(1);
                gaugeOpt.series[1].data[0].value = ysy;
                gaugeOpt.series[1].max = Math.round(ysy*2/5) * 5;
                gaugeOpt.series[2].data[0].value = wsy;
                gaugeOpt.series[2].max = Math.round(wsy*2/5) * 5;

                gauge.hideLoading();
                gauge.setOption(gaugeOpt);
            }
        });

    };

    var echartsInit = function (id) {
        // return echarts.init(document.getElementById(id), 'customed');
        return echarts.init(document.getElementById(id));
    };

    var bar1 = echartsInit('bar1');
    var gauge = echartsInit('gauge');

    var bar1Opt = {
        tooltip : {
            trigger: 'axis',
        },
        legend: {
            data:['一级预警','二级预警','三级预警','四级预警','五级预警']
        },
        grid: {
            left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                data : []
            }
        ],
            yAxis : [
            {
                type : 'value'
            }
        ],
            series : [
            {
                name:'一级预警',
                type:'bar',
                stack: '等级',
                data:[]
            },
            {
                name:'二级预警',
                type:'bar',
                stack: '等级',
                data:[]
            },
            {
                name:'三级预警',
                type:'bar',
                stack: '等级',
                data:[]
            },
            {
                name:'四级预警',
                type:'bar',
                stack: '等级',
                data:[]
            },
            {
                name:'五级预警',
                type:'bar',
                stack: '等级',
                data:[]
            }
        ]
    };

    var gaugeOpt = {
        /*title: {
            x:'center',
            text: '库容占比',
            textStyle: {
                fontSize: 15
            }
        },*/
        tooltip : {
            formatter: "{a} <br/>{c} {b}"
        },
        series : [
            {
                name: '库容比',
                type: 'gauge',
                z: 3,
                min: 0,
                max: 100,
                splitNumber: 10,
                radius: '70%',
                axisLine: {            // 坐标轴线
                    lineStyle: {       // 属性lineStyle控制线条样式
                        width: 10
                    }
                },
                axisTick: {            // 坐标轴小标记
                    length: 15,        // 属性length控制线长
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: 'auto'
                    }
                },
                splitLine: {           // 分隔线
                    length: 20,         // 属性length控制线长
                    lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                        color: 'auto'
                    }
                },
                axisLabel: {
                    backgroundColor: 'auto',
                    borderRadius: 2,
                    color: '#eee',
                    padding: 3,
                    textShadowBlur: 2,
                    textShadowOffsetX: 1,
                    textShadowOffsetY: 1,
                    textShadowColor: '#222'
                },
                title : {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    fontWeight: 'bolder',
                    fontSize: 20,
                   // color: '#fff'
                },
                detail : {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    fontWeight: 'bolder',
                    borderRadius: 3,
                    backgroundColor: '#444',
                    borderColor: '#aaa',
                    shadowBlur: 5,
                    shadowColor: '#333',
                    shadowOffsetX: 0,
                    shadowOffsetY: 3,
                    borderWidth: 2,
                    textBorderColor: '#000',
                    textBorderWidth: 2,
                    textShadowBlur: 2,
                    textShadowColor: '#fff',
                    textShadowOffsetX: 0,
                    textShadowOffsetY: 0,
                    fontFamily: 'Arial',
                    width: 100,
                    color: '#eee',
                    rich: {}
                },
                data:[{value: 12.2, name: '库容比(%)'}]
            },
            {
                name: '已使用',
                type: 'gauge',
                center: ['23%', '55%'],    // 默认全局居中
                radius: '45%',
                min:0,
                max:700,
                endAngle:45,
                splitNumber:5,
                axisLine: {            // 坐标轴线
                    lineStyle: {       // 属性lineStyle控制线条样式
                        width: 8
                    }
                },
                axisTick: {            // 坐标轴小标记
                    length:12,        // 属性length控制线长
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: 'auto'
                    }
                },
                splitLine: {           // 分隔线
                    length:20,         // 属性length控制线长
                    lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                        color: 'auto'
                    }
                },
                pointer: {
                    width:5
                },
                title: {
                    offsetCenter: [0, '-30%'],       // x, y，单位px
                    //color: '#fff'
                },
                detail: {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    fontWeight: 'bolder'
                },
                data:[{value: 150, name: '已使用'}]
            },
            {
                name: '未使用',
                type: 'gauge',
                center: ['77%', '55%'],    // 默认全局居中
                radius: '45%',
                min: 0,
                max: 120,
                startAngle: 133,
                endAngle: -45,
                splitNumber: 5,
                axisLine: {            // 坐标轴线
                    lineStyle: {       // 属性lineStyle控制线条样式
                        width: 8
                    }
                },
                axisTick: {            // 坐标轴小标记
                    splitNumber: 5,
                    length: 10,        // 属性length控制线长
                    lineStyle: {        // 属性lineStyle控制线条样式
                        color: 'auto'
                    }
                },
                splitLine: {           // 分隔线
                    length: 15,         // 属性length控制线长
                    lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                        color: 'auto'
                    }
                },
                pointer: {
                    width: 2
                },
                detail: {
                    fontWeight: 'bolder'
                },
                title: {
                    //color: '#fff'
                },
                data: [{value: 100, name: '未使用'}]
            }
        ]
    };

    initData();
    if(screen == 1) {
        setTimeout(function () {
            location.href = '/app/view/area3_1?sc=1';
        }, config.screenRefreshTime);
    }
})

