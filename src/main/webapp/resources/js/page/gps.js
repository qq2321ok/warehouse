//load echart data
// 基于准备好的dom，初始化echarts实例
var myChart = echarts.init(document.getElementById('main'));

var myMounth = '全年';
var myHosName = '实顺物流实时路线';
var planePath = "path://M917.965523 917.331585c0 22.469758-17.891486 40.699957-39.913035 40.699957-22.058388 0-39.913035-18.2302-39.913035-40.699957l-0.075725-0.490164-1.087774 0c-18.945491-157.665903-148.177807-280.296871-306.821991-285.4748-3.412726 0.151449-6.751774 0.562818-10.240225 0.562818-3.450589 0-6.789637-0.410346-10.202363-0.524956-158.606321 5.139044-287.839661 127.806851-306.784128 285.436938l-1.014096 0 0.075725 0.490164c0 22.469758-17.854647 40.699957-39.913035 40.699957s-39.915082-18.2302-39.915082-40.699957l-0.373507-3.789303c0-6.751774 2.026146-12.903891 4.91494-18.531052 21.082154-140.712789 111.075795-258.241552 235.432057-312.784796C288.420387 530.831904 239.989351 444.515003 239.989351 346.604042c0-157.591201 125.33352-285.361213 279.924387-285.361213 154.62873 0 279.960203 127.770012 279.960203 285.361213 0 97.873098-48.391127 184.15316-122.103966 235.545644 124.843356 54.732555 215.099986 172.863023 235.808634 314.211285 2.437515 5.290493 4.01443 10.992355 4.01443 17.181311L917.965523 917.331585zM719.822744 346.679767c0-112.576985-89.544409-203.808826-199.983707-203.808826-110.402459 0-199.944821 91.232864-199.944821 203.808826s89.542362 203.808826 199.944821 203.808826C630.278335 550.488593 719.822744 459.256752 719.822744 346.679767z";
//    简笔人2
//    var  planePath="path://M621.855287 587.643358C708.573965 540.110571 768 442.883654 768 330.666667 768 171.608659 648.609267 42.666667 501.333333 42.666667 354.057399 42.666667 234.666667 171.608659 234.666667 330.666667 234.666667 443.22333 294.453005 540.699038 381.59961 588.07363 125.9882 652.794383 21.333333 855.35859 21.333333 1002.666667L486.175439 1002.666667 1002.666667 1002.666667C1002.666667 815.459407 839.953126 634.458526 621.855287 587.643358Z";

var geoCoordMap = {};

var convertData = function (data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
        var dataItem = data[i];
        var fromCoord = geoCoordMap[dataItem[0].name];
        var toCoord = geoCoordMap[dataItem[1].name];
        if (fromCoord && toCoord) {
            res.push({
                fromName: dataItem[0].name,
                toName: dataItem[1].name,
                chepai:dataItem[2].name,
                muDiDi:dataItem[3].name,
                coords: [fromCoord, toCoord]
            });
        }
    }
    return res;
};

var color = ['#a6c84c', '#ffa022', '#46bee9'];

// var geoCoordMap = {};
function gpsInfo(cfleetno) {
    document.getElementById("track-div").style.display="none";
    $.get("/app/view/gps/getNewestGpsInfo", {startDate: new Date(), endDate: new Date(), cfleetno: cfleetno}, function (result) {
        if (result.code == "0000") {
            var option = null;
            var BJData = new Array();
            var fromArea = "南昌市南昌县";
            geoCoordMap[fromArea] = [115.806156, 28.632797];
            var fa = {name: fromArea};
            for (var i in result.data) {
                var temp = result.data[i];
                var currPos = temp.VCCITY + "[" + temp.VCMOBILE + "]";
                geoCoordMap[currPos] = [temp.VCX, temp.VCY];

                var bj = {name: currPos, value: 195};
                var cp = {name:temp.VCMOBILE};
                var mdd = {name:temp.VCCITY};
                var bjObj = new Array();
                bjObj.push(fa);
                bjObj.push(bj);
                bjObj.push(cp);
                bjObj.push(mdd);
                BJData.push(bjObj);
            }


            var mySeries = [];
            [
                [myHosName, BJData]
            ].forEach(function (item, i) {
                mySeries = [];
                mySeries.push({ //线
                    name: item[0],
                    //                      name: item[0] + ' Top10',
                    type: 'lines',
                    zlevel: 1,
                    effect: {
                        show: true,
                        period: 6,
                        trailLength: 0.7,
                        color: '#fff',
                        symbolSize: 1
                    },
                    lineStyle: {
                        normal: {
                            color: color[0],
                            width: 0,
                            curveness: 0.1
                        }
                    },
                    data: convertData(item[1])
                }, { //移动 点
                    name: item[0],
                    //                      name: item[0] + ' Top10',
                    type: 'lines',
                    zlevel: 2,
                    effect: {
                        show: true,
                        period: 6,
                        trailLength: 0,
                        symbol: planePath,
                        symbolSize: 10
                    },
                    lineStyle: {
                        normal: {
                            color: color[1],
                            width: 1,
                            opacity: 0.4,
                            curveness: 0.2
                        }
                    },
                    data: convertData(item[1])
                }, { //省份圆点
                    name: item[0],
                    //                      name: item[0] + ' Top10',
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    zlevel: 5,
                    rippleEffect: {
                        brushType: 'stroke'
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'right',
                            formatter: '{b}'
                        }
                    },
                    symbolSize: function (val) {
                        return val[2] / 20;
                    },
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                var tmp = params.data.value[2]
                                if (tmp < 100) {
                                    return 'red';
                                } else if (tmp > 150) {
                                    return 'yellow'
                                } else
                                    return 'yellow';
                            }
                        }
                    },
                    data: item[1].map(function (dataItem) {
                        return {
                            name: dataItem[1].name,
                            value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
                        };
                    })
                });
            });

            option = {
                backgroundColor: '#404a59',
                title: {
                    text: '实顺物流GPS信号分布',
                    subtext: '(' + myMounth + '份统计结果)',
                    left: 'center',
                    textStyle: {
                        color: '#fff'
                    },
                    subtextStyle: {
                        color: 'yellow',
                        fontWeight: 'bold'
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: function (params) {
                        if (params.seriesIndex == 2 || params.seriesIndex == 5 || params.seriesIndex == 8) {
                            return params.name + '<br>' + '车辆GPS信号';
                        } else if (params.seriesIndex == 1 || params.seriesIndex == 4 || params.seriesIndex == 7) {
                            return params.data.fromName + '→' + params.data.toName;
                        }
                    }
                },
                legend: {
                    orient: 'vertical',
                    top: '10%',
                    left: 'center',
                    data: [myHosName],
                    textStyle: {
                        color: '#fff'
                    },
                    selectedMode: 'single'
                },
                geo: {
                    map: 'china',
                    label: {
                        emphasis: {
                            show: false
                        }
                    },
                    roam: true,
                    itemStyle: {
                        normal: {
                            areaColor: '#323c48',
                            borderColor: '#404a59'
                        },
                        emphasis: {
                            areaColor: '#2a333d'
                        }
                    }
                },
                series: mySeries
            };

            //myChart.clear();
            if (option && typeof option === "object") {
                myChart.setOption(option, true);
            }
            myChart.on("click", function (param) {
                document.getElementById("track-div").style.display="none";
                if(param!=null&&param.data!=null){
                    if(param.data.chepai!=null&&param.data.chepai.length>0){
                        $("#cph-div").text("车牌号："+param.data.chepai);
                        $("#cph-val").val(param.data.chepai);
                        $("#cfd-div").text("出发地："+param.data.fromName);
                        $("#mdd-div").text("目的地："+param.data.muDiDi);
                        document.getElementById("track-div").style.display="";
                        //alert(param.data.chepai+"："+param.data.fromName + '→' + param.data.muDiDi);
                    }else{
                        alert("请点击轨迹线");
                    }
                }
            });
        }
    });
}

gpsInfo('-9090');

var initWeather = function () {
    $.get("/app/view/weather/jxWeather", function (result) {
        if (result.code == "0000" && result.data != null) {
            var data = result.data;
            var weatherHtml = "<div class=\"weather\">" +
                "<div style=\"text-align: center;\"><a href=\"javascript:void(0);\" onclick=\"clickWeather();\">城市天气</a></div></div>";
            $.each(data, function (key, values) {
                weatherHtml += "<div class=\"weather\"><div style=\"\">"
                    + values.capital + "</div><div>"
                    + values.stateDetailed + "</div><div>"
                    + values.tem + "</div><div>"
                    + values.windState + "</div></div>";
            });
            $(".weather-panel").empty().append(weatherHtml);
        }
    });
}

initWeather();

var initCfleetno = function () {
    $.get("/app/view/gps/getOrderBifleet", {startDate: new Date(), endDate: new Date()}, function (result) {
        if (result.code == "0000" && result.data != null) {
            var data = result.data;
            var cfleetnoHtml = "<option value='-9090'>选择车队</option>";
            $.each(data, function (key, values) {
                cfleetnoHtml += "<option value='" + values.CFLEETNO + "'>" + values.VCFLEETNAME + "</option>";
            });
            $("#cfleetnoSel").empty().append(cfleetnoHtml);
        }
    });
}

initCfleetno();


window.onresize = function () {
    clearTimeout(window.myChartTimeId);


    window.myChartTimeId = setTimeout(function () {
        myChart.resize();
    }, 200);
    // myChart.resize();
}

function clickWeather() {
    location.href = 'weather';
}

function clickTrack() {
    var vcmobile = $("#cph-val").val();
    location.href = encodeURI('track?vcmobile='+vcmobile);
}
if(screen == 1) {
    setTimeout(function () {
        location.href = '/app/view/weather?sc=1';
    }, config.screenRefreshTime);
}