
$(function () {

    var initData = function () {
        line1.showLoading({ text: '加载中...', textColor: '#fff', maskColor: 'rgba(0, 0, 0, 0.1)' });
        line2.showLoading({ text: '加载中...', textColor: '#fff', maskColor: 'rgba(0, 0, 0, 0.1)' });
        line3.showLoading({ text: '加载中...', textColor: '#fff', maskColor: 'rgba(0, 0, 0, 0.1)' });
        $.get("/app/view/order/getOrderMonthLineData", function (result) {
            if (result.code == "0000" && result.data != null) {
                var data = result.data;

                var xData = [];
                var seriesData1 = [];
                var seriesData2 = [];
                var seriesData3 = [];
                var legendData = [];
                $.each(data, function (key, values) {
                    xData.push(key.substring(6));
                    var fayu = values.fasongzhengchanglv;
                    var zaitu = values.zaituzhengchanglv;
                    var zhunshi = values.zhunshijiaofulv;
                    for(var i = 0; i < fayu.length; i++) {
                        var map = {};
                        var lv = (fayu[i].lv * 100).toFixed(1);
                        if(typeof(seriesData1[i]) == "undefined") {
                            map.name = fayu[i].name;
                            legendData.push(fayu[i].name);
                            map.type = 'line';
                            var dd = [];
                            dd.push(lv);
                            map.data = dd;
                        } else {
                            map = seriesData1[i];
                            var dd = map.data;
                            dd.push(lv);
                            map.data = dd;
                        }
                        seriesData1[i] = map;
                    }
                    for(var i = 0; i < zaitu.length; i++) {
                        var map = {};
                        var lv = (zaitu[i].lv * 100).toFixed(1);
                        if (typeof(seriesData2[i]) == "undefined") {
                            map.name = zaitu[i].name;
                            map.type = 'line';
                            var dd = [];
                            dd.push(lv);
                            map.data = dd;
                        } else {
                            map = seriesData2[i];
                            var dd = map.data;
                            dd.push(lv);
                            map.data = dd;
                        }
                        seriesData2[i] = map;
                    }
                    for(var i = 0; i < zhunshi.length; i++) {
                        var map = {};
                        var lv = (zhunshi[i].lv * 100).toFixed(1);
                        if (typeof(seriesData3[i]) == "undefined") {
                            map.name = zhunshi[i].name;
                            map.type = 'line';
                            var dd = [];
                            dd.push(lv);
                            map.data = dd;
                        } else {
                            map = seriesData3[i];
                            var dd = map.data;
                            dd.push(lv);
                            map.data = dd;
                        }
                        seriesData3[i] = map;
                    }

                });

                line1.hideLoading();
                line2.hideLoading();
                line3.hideLoading();

                line1Opt.xAxis.data = xData;
                line2Opt.xAxis.data = xData;
                line3Opt.xAxis.data = xData;
                line1Opt.legend.data = legendData;
                line2Opt.legend.data = legendData;
                line3Opt.legend.data = legendData;
                line1Opt.series = seriesData1;
                line2Opt.series = seriesData2;
                line3Opt.series = seriesData3;

                line1.setOption(line1Opt);
                line2.setOption(line2Opt);
                line3.setOption(line3Opt);

            }
        });
    }

    var echartsInit = function (id) {
        // return echarts.init(document.getElementById(id), 'customed');
        return echarts.init(document.getElementById(id));
    };

    var line1 = echartsInit('line1');
    var line2 = echartsInit('line2');
    var line3 = echartsInit('line3');

    var line1Opt = {
        title: {
            left: 60,
            text: '发运正常率',
            textStyle: {
                fontSize: 15
            }
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:[]
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: []
        },
        yAxis: {
            type: 'value'
        },
        series: [

        ]
    };

    var line2Opt = {
        title: {
            left: 60,
            text: '在途正常率',
            textStyle: {
                fontSize: 15
            }
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:[]
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: []
        },
        yAxis: {
            type: 'value'
        },
        series: []
    };
    var line3Opt = {
        title: {
            left: 60,
            text: '准时交付率',
            textStyle: {
                fontSize: 15
            }
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:[]
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: []
        },
        yAxis: {
            type: 'value'
        },
        series: []
    };

    // line1.setOption(line1Opt);
    // line2.setOption(line2Opt);
    // line3.setOption(line3Opt);

    initData();
    if(screen == 1) {
        setTimeout(function () {
            location.href = '/app/view/area3_2?sc=1';
        }, config.screenRefreshTime);
    }
})

