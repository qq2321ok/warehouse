
$(function () {

    var initData = function () {
        $.get("/app/view/order/getCysTableData", function (result) {
            if (result.code == "0000" && result.data != null) {
                var data = result.data;
                var tbodyHtml = "";
                var allAve = {"z_zt":0, "y_zt":0, "z_zs":0, "y_zs":0, "z_sm":0, "y_sm":0};
                $.each(data, function (key, values) {
                    var rate = {"zt":"无","zs":"无","sm":"无"};
                    if (values != null) {
                        for (var i = 0; i < values.length; i++) {
                            if (values[i].name == "zaituzhengchanglv") {
                                rate.zt = isNaN(values[i].lv) ? '无' : ((values[i].lv * 100).toFixed(1) + "%");
                                allAve.z_zt += values[i].zhengchang;
                                allAve.y_zt += values[i].yichang;
                            } else if (values[i].name == "zhunshijiaofulv") {
                                rate.zs =  isNaN(values[i].lv) ? '无' : ((values[i].lv * 100).toFixed(1) + "%");
                                allAve.z_zs += values[i].zhengchang;
                                allAve.y_zs += values[i].yichang;
                            } else if (values[i].name == "appsaomiaolv") {
                                rate.sm = isNaN(values[i].lv) ? '无' : ((values[i].lv * 100).toFixed(1) + "%");
                                allAve.z_sm += values[i].zhengchang;
                                allAve.y_sm += values[i].yichang;
                            }
                        }
                    }
                    tbodyHtml += "<tr><td>"+key+"</td><td>"+rate.zt+"</td><td>"+rate.zs+"</td><td>"+rate.sm+"</td></tr>"
                });
                $(".table-data tbody").empty().append(tbodyHtml);
                $(".table-data tfoot").empty().append("<tr><th>平均</th><th>"+(allAve.z_zt*100/(allAve.z_zt+allAve.y_zt)).toFixed(1)+"%</th><th>"
                    +(allAve.z_zs*100/(allAve.z_zs+allAve.y_zs)).toFixed(1)+"%</th><th>"+(allAve.z_sm*100/(allAve.z_sm+allAve.y_sm)).toFixed(1)+"%</th></tr>");
            }

        });


    };

    initData();
    if(screen == 1) {
        setTimeout(function () {
            location.href = '/app/view/area3_3?sc=1';
        }, config.screenRefreshTime);
    }
})

