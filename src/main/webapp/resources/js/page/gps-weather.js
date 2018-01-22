$(function () {
    var initData = function () {
        $.get("/app/view/weather/principalCityWeather", function (result) {
            if (result.code == "0000" && result.data != null) {
                var data = result.data;
                var tbodyHtml = "";
                $.each(data, function (key, values) {
                    tbodyHtml += "<tr><td>"
                        + values.capital + "</td><td>"
                        + values.stateDetailed + "</td><td>"
                        + values.tem + "</td><td>"
                        + values.temNow + "</td><td>"
                        + values.windDir +"</td><td>"
                        + values.windPower + "</td><td>"
                        + values.windState + "</td><td>"
                        + values.humidity + "</td></tr>";
                });
                $(".table-data tbody").empty().append(tbodyHtml);
            }
        });
    }

    initData();
    if(screen == 1) {
        setTimeout(function () {
            location.href = '/app/view/gps?sc=1';
        }, config.screenRefreshTime);
    }
})

