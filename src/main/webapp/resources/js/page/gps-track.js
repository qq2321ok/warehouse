// 百度地图API功能
var map = new BMap.Map("allmap");
map.centerAndZoom(new BMap.Point(115.806156, 28.632797), 6);
map.enableScrollWheelZoom();

function addMarker(point, name) {
    var marker = new BMap.Marker(point);
    map.addOverlay(marker);
    var label = new BMap.Label(name, {offset: new BMap.Size(20, -1)});
    label.setStyle({
        color: "red",
        fontSize: "12px",
        backgroundColor: "0.05",
        border: "0",
        fontWeight: "bold"
    });
    marker.setLabel(label);
}

function initTrackData() {
    var points = new Array();
    var request = getRequest();
    var vcmobile = request['vcmobile'];
    $.get("/app/view/gps/getGpsDriverTrack", {startDate: new Date(), endDate: new Date(), vcmobile: vcmobile}, function (result) {
        if (result.code == "0000" && result.data != null) {
            var data = result.data;
            var nanchang = new BMap.Point(115.806156, 28.632797);
            addMarker(nanchang, "南昌市 南昌县");
            points.push(nanchang);
            $.each(data, function (key, values) {
                //alert(key+"===="+values.VCX+"----"+ values.VCY);
                var position = new BMap.Point(values.VCX, values.VCY);
                addMarker(position, values.VCCITY);
                points.push(position);
            });
        }
    });

    // var polyline = new BMap.Polyline([
    //     new BMap.Point(116.432045, 39.910683),
    //     new BMap.Point(120.129721, 30.314429),
    //     new BMap.Point(121.491121, 25.127053)
    // ], {strokeColor: "blue", strokeWeight: 2, strokeOpacity: 0.5});   //创建折线
    setTimeout(function () {
        var sy = new BMap.Symbol(BMap_Symbol_SHAPE_BACKWARD_OPEN_ARROW, {
            scale: 0.3,//图标缩放大小
            strokeColor: '#fff',//设置矢量图标的线填充颜色
            strokeWeight: '1',//设置线宽
        });
        var icons = new BMap.IconSequence(sy, '10', '30');
        var polyline = new BMap.Polyline(points, {
            icons: [icons],
            strokeWeight: '3',//折线的宽度，以像素为单位
            strokeOpacity: 0.8,//折线的透明度，取值范围0 - 1
            strokeColor: "#18a45b" //折线颜色
        });   //创建折线
        map.addOverlay(polyline);   //增加折线
    }, 2000);

}

initTrackData();

function getRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}