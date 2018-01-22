var monitor=m={
	init:function(){
	    $(".monitor_table").bind("click",m.changeWndNum);

        var iRet = WebVideoCtrl.I_CheckPluginInstall();
        if (-2 == iRet) {
            alert("您的Chrome浏览器版本过高，不支持NPAPI插件！");
            return;
        } else if (-1 == iRet) {
            alert("您还未安装过插件，双击开发包目录里的WebComponentsKit.exe安装！");
            return;
        }

        // 初始化插件参数及插入插件
        WebVideoCtrl.I_InitPlugin("100%", "100%", {
            bWndFull: true,//是否支持单窗口双击全屏，默认支持 true:支持 false:不支持
            iWndowType: 2,
            cbSelWnd: function (xmlDoc) {
                m.index = $(xmlDoc).find("SelectWnd").eq(0).text();
               console.log("当前选择的窗口编号：" + m.index);
            }
        });
        WebVideoCtrl.I_InsertOBJECTPlugin("monitor_plugin");

	},
    changeWndNum:function(){
	    var n=$(this).attr("n");
	    if(n=="play"){
	        if(typeof menu.map[menu.l2id]=="object" && typeof  menu.map[menu.l2id].children=="object" && menu.map[menu.l2id].children.length>0){
                var c=menu.map[menu.l2id].children;
                var r=0;
                for(var i=0;i<c.length;i++){
                    if(c[i].status=="1"){
                        m.play(c[i],r);
                        r++;
                    }
                }
            }

	        return ;
        }
	    n=parseInt(n,10)
        WebVideoCtrl.I_ChangeWndNum(n);
    },
    conn:function(d){
	    if(typeof m.login_ip=="string" && m.login_ip!=""){
            var iRet = WebVideoCtrl.I_Logout(m.login_ip);
            m.login_ip="";
        }
        m.login_ip=d.ip;
        var iRet = WebVideoCtrl.I_Login(d.ip, 1, d.port, d.user, d.pass, {
            success: function (xmlDoc) {
                    m.getChannelInfo();
            },
            error: function () {
                showOPInfo(szIP + " 登录失败！");
            }
        });

        if (-1 == iRet) {
            showOPInfo(szIP + " 已登录过！");
        }
    },
    getChannelInfo:function(){
        // 数字通道
        WebVideoCtrl.I_GetDigitalChannelInfo(m.login_ip, {
            async: false,
            success: function (xmlDoc) {
                var oChannels = $(xmlDoc).find("InputProxyChannelStatus");
                var arr=[];
                var s=1;
                var r=0;
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
                menu.editDom(menu.l2id,arr);
                if(r==0){
                    s=1;
                }else if(r<(arr.length-1)){
                    s=2;
                }else{
                    s=3;
                }
                $("#menu").find("div[sid="+menu.l2id+"]").toggleClass("status_1",false).toggleClass("status_2",false).toggleClass("status_3",false).toggleClass("status_"+s,true);


            },
            error: function () {
            }
        });
    },
    play:function(d,i){
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus((typeof i=="number"?i:m.index));
        if (oWndInfo != null) {// 已经在播放了，先停止
            WebVideoCtrl.I_Stop();
        }

        var iRet = WebVideoCtrl.I_StartRealPlay(m.login_ip, {
            iWndIndex:(typeof i=="number"?i:m.index),
            iStreamType: 1,
            iChannelID: parseInt(d.index,10),
            bZeroChannel: false
        });

    }
};

$(function(){
    m.init();
})