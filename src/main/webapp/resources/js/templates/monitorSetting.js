
    var toAddMonitor = function () {
        $(".modal-title").text('新增设备');
        $('#monitorModal').modal();
    };

    var toEditMonitor = function () {
        var checkedObj = $("input:checkbox:checked");
        if(checkedObj.length == 0) {
            layer.msg("请先选择修改项");
            return false;
        }
        $(".modal-title").text('修改设备');
        $('#monitorModal').modal();
        var tdElem = $(checkedObj[0]).parent().parent().children('td');
        $("#id").val(checkedObj[0].value);
        $("#ip").val(tdElem.eq(1).text());
        $("#port").val(tdElem.eq(2).text());
        $("#status").val(tdElem.eq(3).text());
        $("#sbtdh").val(tdElem.eq(5).text());
        $("#tdh").val(tdElem.eq(6).text());
        $("#username").val(tdElem.eq(7).text());
        $("#password").val(tdElem.eq(8).text());
        $("#des").val(tdElem.eq(9).text());
        $("#pid").val(tdElem.eq(10).text());
    };

    var toDeleteMonitor = function () {
        var checkedObj = $("input:checkbox:checked");
        if(checkedObj.length == 0) {
            layer.msg("请先勾选删除项");
            return false;
        }
        var index = layer.confirm('确认删除？', {
            btn:  ['确认', '取消']
        }, function() {
            $.get("/app/monitor/delete/" + checkedObj[0].value, function (result) {
                if(result.code == "0000") {
                    layer.close(index);
                    layer.msg("删除成功");
                    $(checkedObj[0]).parent().parent().remove();
                } else {
                    layer.msg("删除失败");
                }
            });
        });
    };

    $('#monitorModal').on('hidden.bs.modal', function (e) {
        $("#id").val("");
        $("#monitorForm")[0].reset();
    });

    $("input:checkbox").change(function() {
        if($(this).prop("checked")) {
            $(this).parent().parent().siblings().find("input:checkbox").prop("checked", false);
        }
    });