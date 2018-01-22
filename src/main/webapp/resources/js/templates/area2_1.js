
$(function () {
    var showFlag = "M";
    var initData = function () {
        pie1.showLoading({text: '加载中...', textColor: '#fff', maskColor: 'rgba(0, 0, 0, 0.1)'});
        pie2.showLoading({text: '加载中...', textColor: '#fff', maskColor: 'rgba(0, 0, 0, 0.1)'});
        pie3.showLoading({text: '加载中...', textColor: '#fff', maskColor: 'rgba(0, 0, 0, 0.1)'});
        pie4.showLoading({text: '加载中...', textColor: '#fff', maskColor: 'rgba(0, 0, 0, 0.1)'});
        $.get("/app/view/order/getYslxTableData", function (result) {
            if (result.code == "0000" && result.data != null) {
                var data = result.data;
                var seriesData1 = [];
                var seriesData2 = [];
                var seriesData3 = [];
                var seriesData4 = [];

                var heji = {"m_rs":0, "y_rs":0, "m_lgl":0,"y_lgl":0, "m_tl":0,"y_tl":0,"m_swb":0,"y_swb":0};
                var tbodyHtml = "";
                $.each(data, function (key, values) {
                    var sl = {"m_rs":0, "y_rs":0, "m_lgl":0,"y_lgl":0, "m_tl":0,"y_tl":0,"m_swb":0,"y_swb":0};
                    var arry = values.m;
                    if (arry != null) {
                        for (var i = 0; i < arry.length; i++) {
                                var map = {"name": key, value: arry[i].count};
                                if (arry[i].name == "rensong") {
                                    sl.m_rs = arry[i].count
                                    heji.m_rs += arry[i].count;
                                    if (showFlag == "M") seriesData1.push(map);
                                } else if (arry[i].name == "linggongli") {
                                    sl.m_lgl = arry[i].count
                                    heji.m_lgl += arry[i].count;
                                    if (showFlag == "M") seriesData2.push(map);
                                } else if (arry[i].name == "tielu") {
                                    sl.m_tl = arry[i].count
                                    heji.m_tl += arry[i].count;
                                    if (showFlag == "M") seriesData3.push(map);
                                } else if (arry[i].name == "siweiban") {
                                    sl.m_swb = arry[i].count
                                    heji.m_swb += arry[i].count;
                                    if (showFlag == "M") seriesData4.push(map);
                                }
                        }
                    }

                    var arry2 = values.y;

                    if (arry2 != null) {
                        for (var i = 0; i < arry2.length; i++) {
                            var map = {"name": key, value: arry2[i].count};
                            if (arry2[i].name == "rensong") {
                                sl.y_rs = arry2[i].count
                                heji.y_rs += arry2[i].count;
                                if (showFlag == "Y") seriesData1.push(map);
                            } else if (arry2[i].name == "linggongli") {
                                sl.y_lgl = arry2[i].count
                                heji.y_lgl += arry2[i].count;
                                if (showFlag == "Y") seriesData2.push(map);
                            } else if (arry2[i].name == "tielu") {
                                sl.y_tl = arry2[i].count
                                heji.y_tl += arry2[i].count;
                                if (showFlag == "Y") seriesData3.push(map)
                            } else if (arry2[i].name == "siweiban") {
                                sl.y_swb = arry2[i].count
                                heji.y_swb += arry2[i].count;
                                if (showFlag == "Y") seriesData4.push(map);
                            }
                        }
                    }
                    tbodyHtml += "<tr><td>"+key+"</td><td>"+sl.m_rs+"</td><td>"+sl.y_rs+"</td><td>"+sl.m_lgl+"</td><td>"+sl.y_lgl+
                        "</td><td>"+sl.m_tl+"</td><td>"+sl.y_tl+"</td><td>"+sl.m_swb+"</td><td>"+sl.y_swb+"</td></tr>"
                });
                $(".table-data tbody").empty().append(tbodyHtml);
                $(".table-data tfoot").empty().append("<tr><th>合计</th><th>"+heji.m_rs+"</th><th>"+heji.y_rs+"</th><th>"+heji.m_lgl +
                    "</th><th>"+heji.y_lgl+"</th><th>"+heji.m_tl+"</th><th>"+heji.y_tl+"</th><th>"+heji.m_swb+"</th><th>"+heji.y_swb+"</th></tr>");
                pie1.hideLoading();
                pie2.hideLoading();
                pie3.hideLoading();
                pie4.hideLoading();

                pie1Opt.series[0].data = seriesData1;
                pie2Opt.series[0].data = seriesData2;
                pie3Opt.series[0].data = seriesData3;
                pie4Opt.series[0].data = seriesData4;
                pie1Opt.title.text = '备料数 ' + (showFlag == "M" ? '当月累计' : '当年累计');
                pie2Opt.title.text = '提车数 ' + (showFlag == "M" ? '当月累计' : '当年累计');
                pie3Opt.title.text = '发运数 ' + (showFlag == "M" ? '当月累计' : '当年累计');
                pie4Opt.title.text = '到达数 ' + (showFlag == "M" ? '当月累计' : '当年累计');

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
    /*if(screen == 1) {
        setInterval(initData, config.screenRefreshTime);
        setTimeout(function () { location.href = '/app/view/area2_2?sc=1'; }, 2 * config.screenRefreshTime);
    }*/
})

