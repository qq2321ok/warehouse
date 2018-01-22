var menu={
	init:function(id,d){
        var dom="<li><div class=\"menu_show_title menu_icon_$level$ $status$\" sid='$id$'><div class=\"menu_icon\"><span class='$icon$'></span></div>";
        dom+="<div class=\"menu_title\">$title$</div></div>";
        dom+="<div class=\"menu_children\" id='menu_$id$_children'>$children$</div></li>";
        menu.dom=dom;
        menu.map=ehi.TreeMap(d,"id","children");
        var html=menu.createDom(d,1);
        $("#"+id).html(html);
        $("#"+id).find("div[sid]").bind("click",menu._click);
	},
	_click:function (e) {
		var sid=$(this).attr("sid");
		if(typeof menu.map[sid]=="object"){
			if(typeof menu.map[sid].children=="object" && menu.map[sid].children.length>0){
				var c=$("#menu_"+sid+"_children");
				if(c.css("display")=="block"){
					c.css("display","none");
				}else{
                    c.css("display","block");
				}
			}
			if($(this).hasClass("menu_icon_2")){
			    if(typeof menu.map[sid].ip=="string" && typeof menu.map[sid].port=="string" && $("#menu_"+sid+"_children").html()==""){
                    menu.l2id=sid;
			        monitor.conn(menu.map[sid]);
                    $("#menu_"+sid+"_children").css("display","block");
                }
			}
            if($(this).hasClass("menu_icon_3")){
			    menu.l3id=sid;
                monitor.play(menu.map[sid]);
            }
		}
    },
	createDom:function(d,level){
		var html="";
        for(var i=0;i<d.length;i++){
        	var ht=menu.dom;
        	if(level == 1) {
                ht=ehi.replace(ht,"$icon$", "glyphicon glyphicon-th-large");
            } else if(level == 2) {
                ht=ehi.replace(ht,"$icon$", "glyphicon glyphicon-facetime-video");
            }
            ht=ehi.replace(ht,"$level$",level);
            ht=ehi.replace(ht,"$title$",d[i].title);
            ht=ehi.replace(ht,"$id$",d[i].id);
        	if(typeof d[i].status!="undefined"){
                ht=ehi.replace(ht,"$status$","status_"+d[i].status);
			}else{
                ht=ehi.replace(ht,"$status$","");
			}
			if(typeof d[i].children=="object" && d[i].children.length>0){
                ht=ehi.replace(ht,"$children$","<ul>"+menu.createDom(d[i].children,level+1)+"</ul>");
			}else{
                ht=ehi.replace(ht,"$children$","");
			}
            html+=ht;
        }
        html="<ul>"+html+"</ul>";
		return html;
	},
    editDom:function(id,d){
	    var dom=menu.createDom(d,3);
	    var o=$("#menu_"+id+"_children");
	    if(o[0]){
	        o.html(dom);
        }
        var map=ehi.TreeMap(d,"id","children");
	    for(var x in map){
            menu.map[x]=map[x];
        }
        menu.map[id].children=d;
        o.find("div[sid]").bind("click",menu._click);
    }
};

$(function() {

	/*var m=[
		{"id":"1","title":"江苏安机汽车物流","children":[
            {"id":"2","title":"摄像机1","ip":"192.168.60.5","port":"80","user":"admin","pass":"et123456"},
            {"id":"7","title":"摄像机2","status":"2","children":[
                {"id":"8","title":"通道01","status":"1"},
                {"id":"9","title":"通道02","status":"2"},
                {"id":"10","title":"通道03","status":"3"},
                {"id":"11","title":"通道04","status":"1"}
            ]},
            {"id":"12","title":"摄像机3","status":"2","children":[
                {"id":"13","title":"通道01","status":"1"},
                {"id":"14","title":"通道02","status":"2"},
                {"id":"15","title":"通道03","status":"3"},
                {"id":"16","title":"通道04","status":"1"}
            ]}
		]},
        {"id":"17","title":"重庆丰百物流","children":[
            {"id":"18","title":"摄像机1","status":"2","children":[
                {"id":"19","title":"通道01","status":"1"},
                {"id":"20","title":"通道02","status":"2"}
            ]},
            {"id":"21","title":"摄像机2","status":"2","children":[
                {"id":"22","title":"通道01","status":"1"},
                {"id":"23","title":"通道02","status":"2"},
                {"id":"24","title":"通道03","status":"3"},
                {"id":"25","title":"通道04","status":"1"}
            ]},
            {"id":"26","title":"摄像机3","status":"2","children":[
                {"id":"27","title":"通道01","status":"1"},
                {"id":"28","title":"通道02","status":"2"},
                {"id":"29","title":"通道03","status":"3"},
                {"id":"30","title":"通道04","status":"1"}
            ]}
        ]}
	];
    menu.init("menu",m);*/


    $("._toggle ._open").click(function () {
        $(this).hide();
        $("._toggle ._close").show();
        $("#jkxx").addClass("jkxx_close");
        $("#jkview").addClass("jkview_open");

        var nav =  $("._nav");
        if(nav.hasClass("_nav_open")) {
            nav.removeClass("_nav_open");
            nav.addClass("_nav_close");
        }
    });
    $("._toggle ._close").click(function () {
        $(this).hide();
        $("._toggle ._open").show();
        $("#jkxx").removeClass("jkxx_close");
        $("#jkview").removeClass("jkview_open");
    });

    var monitorPlay = function (d) {
        if(typeof monitor.login_ip=="string" && monitor.login_ip!=""){
            var iRet = WebVideoCtrl.I_Logout(monitor.login_ip);
            monitor.login_ip = "";
        }
        monitor.login_ip = d.ip;
        var iRet = WebVideoCtrl.I_Login(d.ip, 1, d.port, d.user, d.pass, {
            success: function (xmlDoc) {
                WebVideoCtrl.I_GetDigitalChannelInfo(monitor.login_ip, {
                    async: false,
                    success: function (xmlDoc) {
                        var oChannels = $(xmlDoc).find("InputProxyChannelStatus");
                        var arr = [];
                        var r = 0;
                        $.each(oChannels, function (i) {
                            var id = $(this).find("id").eq(0).text(),
                                name = $(this).find("name").eq(0).text(),
                                online = $(this).find("online").eq(0).text();
                            if ("" == name) {
                                name = "IPCamera " + (i < 9 ? "0" + (i + 1) : (i + 1));
                            }
                            if(online=="false"){
                                r++;
                            }
                            arr.push({"id":menu.l2id+"_"+id,"title":name,"status":(online=="false"?"3":"1"),"index":id});
                        });

                        var n = arr.length;
                        if(n <= 4) {
                            n = 2;
                        } else if(n <= 9) {
                            n = 3;
                        } else {
                            n = 4;
                        }
                        WebVideoCtrl.I_ChangeWndNum(n);
                        var rr=0;
                        for(var i=0;i<arr.length;i++){
                            if(arr[i].status=="1"){
                                monitor.play(arr[i],rr);
                                rr++;
                            }
                        }
                    }
                });
            },
            error: function () {
                showOPInfo(szIP + " 登录失败！");
            }
        });
        if (-1 == iRet) {
            showOPInfo(szIP + " 已登录过！");
        }
    };

    var delayPlay = function (d, time) {
        setTimeout(function () {
            monitorPlay(d);
        }, time);
    };

    $.get("/app/view/monitor/getList", function (result) {
        if(result.code == "0000" && result.data != null) {
            var m = result.data;
            menu.init("menu",m);

            /************************************************************************/
            if(screen == 1) {
                for (var i = 0, count = 0, size = m.length; i < size; i++) {
                    var child = m[i].children;
                    if (child) {
                        for (var k = 0; k < child.length; k++) {
                            delayPlay(child[k], count++ * config.monitorRefreshTime);
                        }
                    }
                    if (i == size - 1) {
                        setTimeout(function () {
                            location.reload();
                        }, ++count * config.monitorRefreshTime);
                    }
                }
            }
            /************************************************************************/
        }
    });

});