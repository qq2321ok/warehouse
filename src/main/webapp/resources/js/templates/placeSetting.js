
    var toAddPlace = function () {
        $(".modal-title").text('新增地点');
        $('#placeModal').modal();
    };

    var toEditPlace = function () {
        var checkedObj = $("input:checkbox:checked");
        if(checkedObj.length == 0) {
            layer.msg("请先选择修改项");
            return false;
        }
        $(".modal-title").text('修改地点');
        $('#placeModal').modal();
        $("#placeId").val(checkedObj[0].value);
        $("#placeName").val($(checkedObj[0]).parent().next().next().text());
    };

    var toDeletePlace = function () {
        var checkedObj = $("input:checkbox:checked");
        if(checkedObj.length == 0) {
            layer.msg("请先勾选删除项");
            return false;
        }
        var index = layer.confirm('确认删除？', {
            btn:  ['确认', '取消']
        }, function() {
            $.get("/app/place/delete/" + checkedObj[0].value, function (result) {
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

    var savePlace = function () {
       var name = $("#placeName").val().trim();
       if(name.length == 0) {
           layer.tips("请输入地点名称", "#placeName");
           return false;
       }
       var id = $("#placeId").val();
       $.post(id ? "/app/place/update" : "/app/place/save", {name: name, id: id, _csrf: _token}, function (result) {
            if(result.code == "0000") {
                location.reload();
            } else {
                layer.msg("操作失败");
            }
       });
    };

    $('#placeModal').on('hidden.bs.modal', function (e) {
       $("#placeId").val("");
       $("#placeName").val("");
    });

    $("input:checkbox").change(function() {
        if($(this).prop("checked")) {
            $(this).parent().parent().siblings().find("input:checkbox").prop("checked", false);
        }
    });