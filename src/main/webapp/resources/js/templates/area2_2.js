
$(function () {
    var showFlag = "M";
    var initData = function () {
        pie1.showLoading({text: '加载中...', textColor: '#fff', maskColor: 'rgba(0, 0, 0, 0.1)'});
        pie2.showLoading({text: '加载中...', textColor: '#fff', maskColor: 'rgba(0, 0, 0, 0.1)'});
        pie3.showLoading({text: '加载中...', textColor: '#fff', maskColor: 'rgba(0, 0, 0, 0.1)'});
        pie4.showLoading({text: '加载中...', textColor: '#fff', maskColor: 'rgba(0, 0, 0, 0.1)'});
        $.get("/app/view/order/getOrderTableData", function (result) {
            if (result.code == "0000" && result.data != null) {
                var data = result.data;
                var seriesData1 = [];
                var seriesData2 = [];
                var seriesData3 = [];
                var seriesData4 = [];

                var heji = {"m_bl":0, "y_bl":0, "m_tc":0,"y_tc":0, "m_fy":0,"y_fy":0,"m_dd":0,"y_dd":0};
                var tbodyHtml = "";
                $.each(data, function (key, values) {
                    var sl = {"m_bl":0, "y_bl":0, "m_tc":0,"y_tc":0, "m_fy":0,"y_fy":0,"m_dd":0,"y_dd":0};
                    var arry = values.m;
                    if (arry != null) {
                        for (var i = 0; i < arry.length; i++) {
                                var map = {"name": key, value: arry[i].count};
                                if (arry[i].name == "beiliaoshu") {
                                    sl.m_bl = arry[i].count
                                    heji.m_bl += arry[i].count;
                                    if (showFlag == "M") seriesData1.push(map);
                                } else if (arry[i].name == "ticheshu") {
                                    sl.m_tc = arry[i].count
                                    heji.m_tc += arry[i].count;
                                    if (showFlag == "M") seriesData2.push(map);
                                } else if (arry[i].name == "fayunshu") {
                                    sl.m_fy = arry[i].count
                                    heji.m_fy += arry[i].count;
                                    if (showFlag == "M") seriesData3.push(map);
                                } else if (arry[i].name == "daodashu") {
                                    sl.m_dd = arry[i].count
                                    heji.m_dd += arry[i].count;
                                    if (showFlag == "M") seriesData4.push(map);
                                }
                        }
                    }

                    var arry2 = values.y;

                    if (arry2 != null) {
                        for (var i = 0; i < arry2.length; i++) {
                            var map = {"name": key, value: arry2[i].count};
                            if (arry2[i].name == "beiliaoshu") {
                                sl.y_bl = arry2[i].count
                                heji.y_bl += arry2[i].count;
                                if (showFlag == "Y") seriesData1.push(map);
                            } else if (arry2[i].name == "ticheshu") {
                                sl.y_tc = arry2[i].count
                                heji.y_tc += arry2[i].count;
                                if (showFlag == "Y") seriesData2.push(map);
                            } else if (arry2[i].name == "fayunshu") {
                                sl.y_fy = arry2[i].count
                                heji.y_fy += arry2[i].count;
                                if (showFlag == "Y") seriesData3.push(map)
                            } else if (arry2[i].name == "daodashu") {
                                sl.y_dd = arry2[i].count
                                heji.y_dd += arry2[i].count;
                                if (showFlag == "Y") seriesData4.push(map);
                            }
                        }
                    }
                    tbodyHtml += "<tr><td>"+key+"</td><td>"+sl.m_bl+"</td><td>"+sl.y_bl+"</td><td>"+sl.m_tc+"</td><td>"+sl.y_tc+
                        "</td><td>"+sl.m_fy+"</td><td>"+sl.y_fy+"</td><td>"+sl.m_dd+"</td><td>"+sl.y_dd+"</td></tr>"
                });
                $(".table-data tbody").empty().append(tbodyHtml);
                $(".table-data tfoot").empty().append("<tr><th>合计</th><th>"+heji.m_bl+"</th><th>"+heji.y_bl+"</th><th>"+heji.m_tc +
                    "</th><th>"+heji.y_tc+"</th><th>"+heji.m_fy+"</th><th>"+heji.y_fy+"</th><th>"+heji.m_dd+"</th><th>"+heji.y_dd+"</th></tr>");
                pie1.hideLoading();
                pie2.hideLoading();
                pie3.hideLoading();
                pie4.hideLoading();

                pie1Opt.series[0].data = seriesData1;
                pie2Opt.series[0].data = seriesData2;
                pie3Opt.series[0].data = seriesData3;
                pie4Opt.series[0].data = seriesData4;
                pie1Opt.title.text = '人送 ' + (showFlag == "M" ? '当月累计' : '当年累计');
                pie2Opt.title.text = '零公里 ' + (showFlag == "M" ? '当月累计' : '当年累计');
                pie3Opt.title.text = '铁路 ' + (showFlag == "M" ? '当月累计' : '当年累计');
                pie4Opt.title.text = '四位板 ' + (showFlag == "M" ? '当月累计' : '当年累计');

                pie1.setOption(pie1Opt);
                pie2.setOption(pie2Opt);
                pie3.setOption(pie3Opt);
                pie4.setOption(pie4Opt);
            }
            if (showFlag == "M") {
                showFlag = "Y"
            } else {
                showFlag = "M"
            }
        });
    }


    var echartsInit = function (id) {
        // return echarts.init(document.getElementById(id), 'customed');
        return echarts.init(document.getElementById(id));
    };

    var pie1 = echartsInit('pie1');
    var pie2 = echartsInit('pie2');
    var pie3 = echartsInit('pie3');
    var pie4 = echartsInit('pie4');

    var pie1Opt = {
        title : {
            x:'center',
            textStyle: {
                fontSize: 15
            }
        },
        tooltip : {
            trigger: 'item',
            formatter: "{b} : {c}"
        },
        series : [
            {
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:[],
                label: {
                    normal: {
                        formatter:'{b}\n{d}%'
                    }
                },
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    var pie2Opt = {
        title : {
            x:'center',
            textStyle: {
                fontSize: 15
            }
        },
        tooltip : {
            trigger: 'item',
            formatter: "{b} : {c}"
        },
        series : [
            {
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:[],
                label: {
                    normal: {
                        formatter:'{b}\n{d}%'
                    }
                },
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    var pie3Opt = {
        title : {
            x:'center',
            textStyle: {
                fontSize: 15
            }
        },
        tooltip : {
            trigger: 'item',
            formatter: "{b} : {c}"
        },
        series : [
            {
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:[],
                label: {
                    normal: {
                        formatter:'{b}\n{d}%'
                    }
                },
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    var pie4Opt = {
        title : {
            x:'center',
            textStyle: {
                fontSize: 15
            }
        },
        tooltip : {
            trigger: 'item',
            formatter: "{b} : {c}"
        },
        series : [
            {
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:[],
                label: {
                    normal: {
                        formatter:'{b}\n{d}%'
                    }
                },
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    // pie1.setOption(pie1Opt);
    // pie2.setOption(pie2Opt);
    // pie3.setOption(pie3Opt);
    // pie4.setOption(pie4Opt);

    initData();
    if(screen == 1) {
        setInterval(initData, config.screenRefreshTime);
        setTimeout(function () {
            location.href = '/app/view/area2_1?sc=1';
        }, 2 * config.screenRefreshTime);
    }
})

