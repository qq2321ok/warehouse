
var ehi = {
	jjm:function(s){
		if(typeof s=="undefined" || s=="" || s==null){
			   return "";	
			}
			var l=s.length,b=0,z=0,c=String.fromCharCode(0),d,str="";
			for(var i=0;i<l;i++){
			     b=s.charCodeAt(i);
				 d=String.fromCharCode((b+(i+1))-((b&(i+1))*2));
				if(s==c){
				   	str+=s.charAt(i);
				}else{
					str+=d;
				}
			}
			return str;
	},
	isEmpty:function(obj){
		 for (var name in obj)  
		    { 
		        return false; 
		    } 
		    return true; 
	},
	uploadfile:function(f,u,call_back){
		var id = "";
		var url="fileAction.action";
		var floder="";
		var c={};
		var s={};
		var hz="";
		var ht=false;
		if(typeof f=="object"){
			typeof f.id=="string"?id=f.id:"";
			typeof f.url=="string"?url=f.url:"";
			typeof f.floder=="string"?floder=f.floder:"";
			typeof f.call_back=="function"?c=f.call_back:"";
			typeof f.start_back=="function"?s=f.start_back:"";
			typeof f.hz=="string"?hz=f.hz:"";
		}else if(typeof f=="string" && typeof u=="string"){
			url=u;
			floder=f;
		}
		typeof call_back=="function"?c=call_back:"";
		hz=hz.toLowerCase();
		
		function _do(){
			var id=$(this).attr("id");
			var v=$("#"+id).val();
			var opts=$(this).data("upload")
			var ht=false;
			if(opts.hz!=""){
				var lhz=opts.hz.split(",");
				for(var i=0;i<lhz.length;i++){
					if(v.toLowerCase().indexOf("."+lhz[i])>0){
						ht=true;
						continue;
					}
				}
				if(!ht){
					alert("文件格式必须为["+lhz.join(",")+"]");
					return false;
				}
			}
			if(typeof opts.start_back=="function" && opts.start_back()==false){return false;}
			
			
			$("#"+opts.id+"_ehigher_upload_file_form").form("submit",{
				"url":opts.url,
            	onSubmit:function(){
            		return true;
            	},
            	success:function(data){
            		data=$.parseJSON(data);
            		if(typeof opts.call_back=="function"){
            			opts.call_back(data);
            		}
            	}
			});
		}
		
		
	    var dom="<div id='"+id+"_ehigher_upload_file' style='position: absolute; width: 100px; top: 0px; left: 0px;'><form id='"+id+"_ehigher_upload_file_form' method='post' enctype='multipart/form-data'>";
	        dom+="<input id='"+id+"_ehigher_upload_file_floder' type='hidden' name='floder' /><input id='"+id+"_ehigher_upload_file_photo' type='file' name='photo' style='position:absolute;top:0px;left:0px;width: 100%;height:100%; filter:alpha(opacity=0);-moz-opacity:.0;opacity:0.0;cursor:pointer;z-index:999;' /></form></div>";
	    
	        if(!$("#"+id+"_ehigher_upload_file")[0]){	
	        	$('#'+id).append(dom); 
				var w=$('#'+id).width();
				if(w==0){w=80;}
				var h=$('#'+id).height();
				if(h==0){h=25;}
				$("#"+id+"_ehigher_upload_file").css({"width":w,"height":h});
			}
	        $("#"+id+"_ehigher_upload_file_floder").val(floder);
	        //$("#ehigher_upload_file_photo").trigger("click");
	        $("#"+id+"_ehigher_upload_file_photo").unbind().bind("change",_do);
			$("#"+id+"_ehigher_upload_file_photo").data("upload",f);
	},
	camelCase: function( string ) {
		fcamelCase = function( all, letter ) {
			return ( letter + "" ).toUpperCase();
		}
		return string.replace( /_([a-z]|[0-9])/ig, fcamelCase );
	},
	/*
	 * 非正则替换函数
	 * r=原始数据
	 * f=需要被替换的数据
	 * t=需要替换成的数据
	 * n=替换前n位，超过n位的不替换
	 * */
	replace:function(r,f,t,n){
		if(typeof r!="string"){return r;}
		if(typeof r!="string" || f==""){return r;}
		var a=r.split(f);
		if(typeof n=="undefined"){
			var s=a.join(t);
		}else if(typeof n=="number"){
			var s="";
			for(var i=0;i<a.length;i++){
				if(i==(a.length-1)){//如果最后一个则不处理了
					s+=a[i];
					break;
				}
				if((i+1)<=n){
					s+=a[i]+t;
				}else{
					s+=a[i]+f;
				}
			}
		}
		
		return s;
	},
	qxtree:function(s){
		if(window.qxtree == undefined)
		{
			return false;
		}

		for(var i=0;i<window.qxtree.length;i++)
		{
			if(window.qxtree[i].anxx == s)
			{
				return true;
				break;
			}
		}
		return false;
		
	},
	clone:function(d){

		function c(ds){
			var nd={};
			var na=[];
			
			if(ehi.is_array(ds)){
				for(var i=0;i<ds.length;i++){
					if(typeof ds[i]=="object"){
						na.push(c(ds[i]));
					}else if(typeof ds[i]=="undefined"){
						
					}else{
						na.push(ds[i]);
					}
				}
				return na;
			}
			
			for(var x in ds){
				if(typeof ds[x]=="object"){				
				   nd[x]=c(ds[x]);
				}else if(typeof ds[x]=="undefined"){
						
				}else{
				   nd[x]=ds[x];
				}
			}
			return nd;
		}
		return c(d);
	},
    _busy:function(t,s,p){
    	
    	if(window.parent && window.parent.ehi && typeof window.parent.ehi._busy=="function" && p!=true){
    		window.parent.ehi._busy(t,s,true);
    		return false;
    	}
    	
		if(!$("#loading")[0]){
			var dom='<div id="loading" style=" position:absolute; left:0px; top:0px; width:100%; height:100%;z-index:-1; display:none;">';
				dom=dom+'<div id="loading_bg" style="filter:alpha(opacity=50);opacity:0.5; background:#CCCCCC; width:100%; height:100%; position:absolute; left:0px; top:0px; "></div>';
				dom=dom+'<div id="loading_icon" style=" color:#000000; font-size:12px;position:absolute; left:50%; top:50%; border:#666666 1px solid; background:#FFFFFF; padding:3px; width:250px; height:28px; text-align:left; margin-left:-125px;border-radius:5px;">';
				dom=dom+'<img src="resources/img/public/loading_16x16.gif" width="16" height="16" align="absmiddle" style="position: absolute; top: 5px;" />';
				dom=dom+'<div id="loading_text" style="position:absolute; left:30px; top:5px; line-height: 18px;height:18px;width:auto;">载入中，请稍后。</div>';
				dom=dom+'</div>';
				dom=dom+'</div>';
				
				$('body').append(dom);
				$("#loading_bg").bind("click",function(){return false});
		}
		
		/*if($("#loading").css("display")!="none"){
			return false;
		}*/
		if(typeof t=="undefined"){
			t="处理中，请稍后";
			$("#loading").css({"width":"100%","height":"100%","left":"0px","top":"0px"});
		}else if(typeof t=="object"){
									$("#loading").css(
									{
									"width":t.width?t.width:"",
									"height":t.height?t.height:"",
									"left":t.left?t.left:"",
									"right":t.right?t.right:"",
									"top":t.top?t.top:"",
									"bottom":t.bottom?t.bottom:""
									});
			t=t.str;
		}else if(typeof t=="string" && typeof s=="string"){
			var id=$("#"+t);
			if(!id[0]){return false;}
			if(id.css("left")=="auto"){
			   id=id.parent();	
			}
			var left=id.css("left"),top=id.css("top");
									$("#loading").css(
									{
									"width":id[0].offsetWidth,
									"height":id[0].offsetHeight,
									"left":left,
									"top":top
									});
			t=s;
		}else  if(typeof t=="string" && typeof s=="undefined"){
			$("#loading").css({"width":"100%","height":"100%","left":"0px","top":"0px"});
		}

		$("#loading_text").html(t);
		$("#loading").topZindex();
		$("#loading").css({"display":"block"});
	},
	_free:function(p){
		$("#loading").css({"z-index":-1,"display":"none"});
    	if(window.parent && window.parent.ehi && typeof window.parent.ehi._free=="function" && p!=true){
    		window.parent.ehi._free(true);
    	}
	},
	_check:function(ar){
		var str="";
		for(var i=0;i<ar.length;i++){
		    if(typeof ar[i].z!="undefined" && ar[i].z==""){
				str+=ar[i].n+" 不能为空\r\n";
		    }else if(typeof ar[i].v=="string" && $("#"+ar[i].v).val()==""){
				str+=ar[i].n+" 不能为空\r\n";
			}
		}
		if(str!=""){
		   alert(str);
		   return false;
		}else{
		   return true;	
		}
	},
	Request:function(strName,s){
		var strHref=location.href;
		typeof s=="undefined"?s="#":"";
		if(strHref.indexOf(s)==-1){
            if(strName){return "";}else{return {};};
		}
		var strHref=location.href;
		var intPos = strHref.indexOf(s);
		var strRight = strHref.substr(intPos + 1);

		var arrTmp = strRight.split("&");
		var arrList={};
		for(var i = 0; i < arrTmp.length; i++)
		{
			var arrTemp = arrTmp[i].split("=");
			if(strName){
			    if(arrTemp[0].toUpperCase() == strName.toUpperCase()) return arrTemp[1];
			}else{
				arrList[arrTemp[0]]=arrTemp[1];
			}
		}
		if(strName){
		    return "";
		}else{
			return arrList;
		}
	},
	inside_array:function(array_list,find_str,t){
		/*
		 *用户数组内是否存在某一个特定值的判断 
		 * array_list=数组,数组内可为数字，字符或对象
		 * find_str=可为数字，字符，对象包，如果为对象包，则全部存在在返回true  ((((a)*(b)*(c)+(d))+(e))-(f))
		 * 
		 * inside_array([1,2,3,4],2)==true
		 * inside_arrya([{id:1,have:true},{id:2,have:false}],{id:1,have:true})==true
		 * inside_arrya([{id:1,have:true},{id:2,have:false}],{id:1})==true
		 * inside_arrya([{id:1,have:true},{id:2,have:false}],{id:1,have:false})==false
		 * inside_arrya([{id:1,have:true},{id:2,have:false}],{"SQL":"id>1 and have=true"})==true
		 * */
		   
		   var type=typeof find_str;
		   var obj_act=false;
		   if(typeof array_list=="object" && !ehi.is_array(array_list)){
			   array_list=[array_list];
		   }
		   
		   for(var i=0;i<array_list.length;i++){
		      if(type =="number"|| type=="string"){
		          if(array_list[i]==find_str){
		              return (t==true?array_list[i]:true);
		          }
		      }else if(type=="object"){
		          obj_act=true;
		          for(var x in find_str){
					  if(typeof t=="object" && t.like==true){
						  if(array_list[i][x].indexOf(find_str[x])==-1){
							 obj_act=false;
							 break;
						  }
					  }else{
						  if(array_list[i][x]!=find_str[x]){
							 obj_act=false;
							 break;
						  }
					  }
		          }
		          if(obj_act==true){
					  if(typeof t=="object" && t.returnObj==true){
						 return array_list[i];
					  }else{
		             	 return true;
					  }
		          }
		      }
		   }
		   return false;
	},
	focus:function(o){
		if(typeof o=="string"){
			o=$("#"+o);
		}
		if(o[0].createTextRange){
			var range =o[0].createTextRange();
			range.moveStart("character", o.val().length);
			range.collapse(true);
			range.select();
		}else{
			o[0].setSelectionRange(o.val().length, o.val().length);
			o[0].focus();
		}
	},
	_message_id:0,
	_ajax_list:function(par){
		ehi._ajaxList=par;
		ehi._ajax_list_do();
	},
	_ajax_list_do:function(){
		var d="";
		for(var i=0;i<ehi._ajaxList.length;i++){
			if(ehi._ajaxList[i].g!=true){
				d=ehi._ajaxList[i];
				ehi._ajaxList[i].g=true;
				break;
			}
		}
		
		if(d!=""){
			d.url.indexOf("?")>0?"":(d.url=d.url+"?m="+new Date().getTime());
			$.ajax({url: d.url,type:"post",data:d.send_data,dataType:"json",success:function(data){
								if(typeof d.callback=="function"){
									if(typeof d.host=="object"){
										d.callback.call(d.host,data,d);	
									}else{
										d.callback(data,d);	
									}
								}
								ehi._ajax_list_do();
						}});
		}
	},
	_ajax:function(url,success_f,t,send_data,return_obj,par){
		url.indexOf("?")>0?"":(url=url+"?m="+new Date().getTime());
		if(typeof par=="undefined"){
			par={};
		}
		
		return $.ajax({
		  url: url,
		  type:(typeof par.type=="string"?par.type:"post"),
		  data:send_data,
		  dataType:(typeof par.dataType=="string"?par.dataType:"json"),
		  async:(typeof async_=="undefined"?true:async_),
		  success: function(data) { 
					if(typeof success_f=='string' && typeof t!="undefined"){
						t[success_f].call(t,data,return_obj);
					}else if(typeof success_f=='function'){
						success_f.call(t,data,return_obj);
					}else{
					    window[success_f].call(window,data,return_obj)	;
					}
		  },
		  error:function(xhr,status,errorThrown){
			  var t={"timeout":"通讯超时","error":"服务器错误","abort":"","parsererror":""};
			  if(typeof t[status]=="string" && t[status]!=""){
			  		//alert(t[status]);
			  		
			  		if (window.console) {
			  			console.log(t[status]);
			  		}
					ehi._free();
			  }
			 },
			statusCode: {
				404: function() {
					console.log('服务未找到。');
					ehi._free();
				},
				500:function(){
					console.log('服务异常，请刷新后重试。');
					ehi._free();
				}
			}
		});
	},
	_message:function(msg,time_i,f){
		if(typeof msg!="string"){
			msg="处理完成";
		}
		if(typeof window.parent.ehi=="object" && typeof window.parent.ehi._message=="function" && f!=true){
			window.parent.ehi._message(msg,time_i,true);
			return false;
		}
		ehi._message_id++;
		if(typeof time_i=="undefined"){
			time_i=msg.length*100;
			if(time_i<3000){
				time_i=3000;
			}
		};
		if(msg!=""){
			if(!$("#_message")[0]){
			   $('body').append('<div id="_message" style="left:50%; top:50%; position:absolute; font-size:12px; border:#27930e 1px solid; background:#4fab3a; padding:3px; display: none; width:auto; height:26px; line-height: 26px; text-align: center;border-radius:4px; color:#f6f7db;"><div id="_message_nei" style="width:auto;height:20px;white-space:nowrap;font-weight:800; line-height: 20px;"></div></div>');
			}
			$("#_message_nei").html(msg);
			$("#_message").topZindex();
			
			
			
			$("#_message").css({"top":"-100px","display":"block"});
			var w=$("#_message_nei")[0].scrollWidth;
			$("#_message").css({"width":w+40});
			

			var t=0;
			var vh={};

			
			var offset={};

				offset.left=($(window).width()/2)-(w/2);
				offset.top=($(window).height()/2)-10;


			
			//$("#_message").css({"left":((document.body.clientWidth/2)-(w/2))+"px","width":w+"px"});
			$("#_message").animate(offset,500,"easeInOutBack",function(){
				setTimeout("ehi._close_message("+ehi._message_id+")",time_i);
				});
		}
	},
	_close_message:function(i){
		if(ehi._message_id==i){
			$("#_message").animate({"top":"-200px"},800,"easeInOutBack",function(){$("#_message").css({"display":"block"});});
		}
	},
	exp:function(did,url,par){
		    $('#'+did).remove();
			if($('#down_list_panel').html()== null)
			{
				$('body').append('<div id="down_list_panel" style="display:none"><form action="'+url+'" id="'+did+'" method="post" target="_blank"></form></div>');
			}else{
				$('#down_list_panel').append('<form action="'+url+'" id="'+did+'" method="post" target="_blank"></form>');
			}
		
             for(x in par){
            	var str=par[x].toString();
			    $('#'+did).append('<input name="'+x.toString()+'" value="'+str+'">');	
			}
			//$('#'+did).append("<input name='action' value='"+url+"'>");
			
			$('#'+did).submit();			
	},
	/*
	 根据数据获取某个字段，并生成一个新的数据组
	 ArrayList(数组,对象名)
	 */
	ArrayList:function(t,o){
		var arr=[];
		if(ehi.is_array(t)){
			for(var i=0;i<t.length;i++){
				arr.push(t[i][o]);
			}
			
		}else if(typeof t=="object"){
			
			for(var x in t){
				if(typeof o=="string"){
					arr.push(t[x][o]);
				}else if(o==true){
					arr.push(t[x]);
				}else{
				arr.push(x);
				}
			}
		}
		return arr;
	},
	/*
	更具tree制作map
	TreeMap([树的数组],对象名,节点名,父节点连接符)
	*/
	TreeMap:function(t,o,c,fg){
		if(!ehi.is_array(t)){
			var temp=[];
			temp.push(t);
			t=temp;
		}
		var map={};
		typeof fg=="undefined"?fg=".":"";
		function create(t,o,c,f){
			for(var i=0;i<t.length;i++){
				map[t[i][o]]=t[i];
				map[t[i][o]].fid=(f==""?"":f+fg)+t[i][o];
				if(ehi.is_array(t[i][c])){
					create(t[i][c],o,c,map[t[i][o]].fid);
				}
			}
		}
		create(t,o,c,"");
		
		return map;
	},
	/*
	根据array制作map
	ListMap([数组],制作map的对象名,行对象名)
	ListMap({list:[数组],type:"map/map.id/array"},制作map的对象名,行对象名)
	                           map:直接制作map，值为id={}，当存在重复数据时候已后一个数据位准
							   array:直接制作map，值为id=[{}],当群在重复数据的时候，自动向同名的id的数组中增加。可以用于计算重复数量
	
	*/
	ListMap:function(arrObj,id,row){
		var type="";
		var arr=[];
		if(typeof arrObj=="object"){//校验参数格式
		   if(this.is_array(arrObj)){
			  type="map";
			  arr=arrObj;
		   }else{
			 if(this.is_array(arrObj.list)==true){
			    arr=arrObj.list;
				type=arrObj.type?arrObj.type:"map";
			 }else{
			     return false;//参数不正确	 
			 }
		   }
		}else{
		    return false;	
		}
		
		
		
		var o={};
		var rowt=typeof row;
		var t_id=this.is_type(id);
		var z={};
		var name="";
		var t=true;
		for(var i=0;i<arr.length;i++){
			z={};
			name="";
			if(t_id=="string"){
				//typeof arr[i][id]!="undefined"?z=arr[i]:"";
				if(typeof arr[i][id]=="number" || typeof arr[i][id]=="string"){
					z=arr[i];
					name=arr[i][id];
				}
			}else if(t_id=="array"){
				t=true;
			    for(var r=0;r<id.length;r++){
				    if(typeof arr[i][id[r]]=="number" || typeof arr[i][id[r]]=="string"){
						if(name!=""){name+='|';}
						name+=arr[i][id[r]];
					}else{
						t=false;
					}
				}
				if(t==true){
					z=arr[i];
				}else{
				    break;	
				}
			}
			
			if(type=="map"){
				//typeof arr[i][id]!="undefined"?o[arr[i][id]]=arr[i]:"";
				//if(t=="string"){o[arr[i][id]][row]=i;}
				if(rowt=="string"){z[row]=i;}
				o[name]=z;
				
			}else if(type=="array"){
			   	typeof o[name]=="undefined"?o[name]=[]:"";
				if(rowt=="string"){z[row]=i;}
				o[name].push(z);
			}else if(type.substr(0,4)=="map."){
				if(rowt=="string"){z[row]=i;}
				var nt=type.split(".")[1];
				if(typeof o[name]!="object"){
					o[name]={};
				}
				o[name][z[nt]]=z;
			}
		}
		return o;
	},
	is_type:function(a){
		if(typeof a=="object"){
		    if(this.is_array(a)){
			    return "array";
			}else{
			    return "object";	
			}
		}else{
		   return typeof a;	
		}
	},
	is_array:function(a){
		if(typeof a=="undefined"){return false;}
		if (a instanceof Array || 
		(!(a instanceof Object) && 
		(Object.prototype.toString.call((a)) == '[object Array]') || 
		typeof a.length == 'number' && 
		typeof a.splice != 'undefined' && 
		typeof a.propertyIsEnumerable != 'undefined' && 
		!a.propertyIsEnumerable('splice'))) { 
		return true; 
		} 

		
		
		//var d=Object.prototype.toString.call(a);
		//var d=toString.call(a);
		//if(d === '[object Array]'){
		//   return true;
		//}
		return false;
	},
/*
arrL=[arr1,arr2,arr3]将多个数组合并成一个大数组

distinct=数据中合并依据

sortArray排序对象
	sortID=排序对象
	sortList=[xx,xx2,xx4]排序对象
	get=all取全部，list只返回list中存在的，默认为all
	
	
var a=[  
  {"id":4,"st":"123"}, 
  {"id":3,"st":"123."} , 
  {"id":2,"st":"123"} , 
  {"id":1,"st":"123"} 
  
] 
ehi.array_dispose(a,null,{"sortID":"st,id"}); 
	
*/  
	array_dispose:function(arrL,distinct,sortArray){//合并数组，去重复，排序
	
	    var arr=[];
		//alert(typeof arrL);
		if(ehi.is_array(arrL)){
			if(arrL.length==1){
			     arr=ehi.is_array(arrL[0])?arrL[0]:arrL;
			}else if(!ehi.is_array(arrL[0])){
				arr=arrL;
			}
			else{
				for(var i=0;i<arrL.length;i++){
				   if(ehi.is_array(arrL[i])){
						for(var r=0;r<arrL[i].length;r++){
							arr.push(arrL[i][r]);	
						}
				   }else{
					   arr.push(arrL[i]);	
				   }
				}
			}
		}else{
		   return [];	
		}//合并数组完成
		
		if(typeof distinct=="string"){
			var arrDis={};
			
			for(var i=0;i<arr.length;i++){
			    arrDis[arr[i][distinct]]=arr[i];//已对象去重复序列出新的对象
			}
			var arr=[];
			for(x in arrDis){
				 arr.push(arrDis[x]);
			}
		}//去重复后的数组
		
		if(typeof sortArray=="object" && typeof sortArray.sortID=='string'){
			var arrList=[];
			if(typeof sortArray.sortList=="obejct" && sortArray.sortList.length>0){
				for(var i=0;i<sortArray.sortList.length;i++){
				   for(var r=0;r<arr.length;r++){
					   if(typeof arr[r]!="undefined"){
						   if(arr[r][sortArray.sortID]==sortArray.sortList[i]){
							   arrList.push(arr[r]);
							   delete arr[r];
						   }
					   }
				   }
				}
			}else{
				var sort_map={};//排序对象map
				var sort_arr=[];
				var tmp=0;
				var sortID=sortArray.sortID.split(",");
				for(var i=0;i<arr.length;i++){
					tmp=Number(arr[i][sortID[0]]);
					if(typeof tmp=="number"){
						if(typeof sort_map[tmp]=="undefined"){
							sort_arr.push(tmp);
							sort_map[tmp]=[];					
						}
						sort_map[tmp].push(arr[i]);
						
					}
				}
				
				sort_arr=ehi.quickSort(sort_arr);
				for(var i=0;i<sort_arr.length;i++){
					var sm=sort_map[sort_arr[i]];
					if(sm.length>1 && typeof sortID[1]=="string" && sortID[1]!=""){
						var ns=[];
						for(var ni=1;ni<sortID.length;ni++){
							ns.push(sortID[ni]);
						}
						ns=ns.join(",");
						sm=ehi.array_dispose(sm,null,{"sortID":ns});
					}
					for(var r=0;r<sm.length;r++){
						tmp=sm[r];
						if(typeof tmp!="undefined"){
							arrList.push(tmp);
							delete sm[r];
						}
					}
				}
			}
			
			if(typeof sortArray.get=="undefined" && typeof sortArray.sortList!="undefined"){
			    sortArray.get="all";
			}
			
			if( sortArray.get=="all"){
			   for(var r=0;r<arr.length;r++){
				   if(typeof arr[r]!="undefined"){
					   arrList.push(arr[r]);
				   }  
			   }
			}
			arr=arrList;
			
		}
		
		return arr;
		
		
	},
	quickSort:function(array){ 
        var i = 0;  
        var j = array.length - 1;  
        var Sort = function(i, j){  
              
            // 结束条件  
            if(i == j ){ return false;};  
              
            var key = array[i];
            //var v=ehi.clone()
            var tempi = i; // 记录开始位置  
            var tempj = j; // 记录结束位置  
              
            while(j > i){  
                // j <<-------------- 向前查找  
                if(array[j] >= key){  
                    j--;  
                }else{  
                    array[i] = array[j];
                    //i++ ------------>>向后查找  
                    while(j > ++i){  
                        if(array[i] > key){  
                            array[j] = array[i];  
                            break;  
                        }  
                    }  
                }  
            }  
              
            // 如果第一个取出的 key 是最小的数  
            if(tempi == i){  
                Sort(++i, tempj);  
                return ;  
            }  
            // 最后一个空位留给 key  
            array[i] = key;  
              
            // 递归  
            Sort(tempi, i);  
            Sort(j, tempj);  
        };  
          
        Sort(i, j);  
          
        return array;  
    },
	//判断日期，例如（2008-02-12）
	isDate:function(str){
		var r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
		if(r==null)return false;
		var d= new Date(r[1], r[3]-1, r[4]);
		return (d.getFullYear()==r[1]&&(d.getMonth()+1)==r[3]&&d.getDate()==r[4]);
	},
	//判断日期，例如（2008-02-12 12:23:32）    
	isDateTime:function(str){
		var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
		var r = str.match(reg);
		if(r==null)return false;
		var d= new Date(r[1], r[3]-1,r[4],r[5],r[6],r[7]);
		return (d.getFullYear()==r[1]&&(d.getMonth()+1)==r[3]&&d.getDate()==r[4]&&d.getHours()==r[5]&&d.getMinutes()==r[6]&&d.getSeconds()==r[7]);
	},
	//判断日期，例如（12:23:32）    
	isTime:function(str){
		var a = str.match(/^(\d{1,2})(:)?(\d{1,2})\2(\d{1,2})$/);
		if (a == null) {alert('输入的参数不是时间格式'); return false;}
		if (a[1]>24 || a[3]>60 || a[4]>60)
		{
		alert("时间格式不对");
		return false;
		}
		return true;
	},
	length2:function(S){
		st=S.toString();
		if(st.length<2){
		   st="0"+st;	
		}
		return st;
	},
	isNumber:function( s )
	{
		var regu = "^([0-9]|\\.)+$";
		var re = new RegExp(regu);
		if (s.search(re) != - 1) {
			return true;
		}
		else {
			return false;
		}
	},
	isEmpty:function(obj){
		 for (var name in obj)  
		    { 
		        return false; 
		    } 
		    return true; 
	},
	diffDays:function(s1,s2){
		s1 = s1.replace(/-/g, "/");
		 s2 = s2.replace(/-/g, "/");
		 s1 = new Date(s1);
		 s2 = new Date(s2);
		 
		 var days= s2.getTime() - s1.getTime();
		 var time = parseInt(days / (1000 * 60 * 60 * 24));
		 time++;
		 return time;
	},
	add_months:function(d,ds){
		var strd=ehi.formatTime(d,"date").getTime();
		var nd=ehi.formatTime(strd,"date");
		nd.setMonth(nd.getMonth()+ds);
		return nd;
	},
	formatTime:function(dt,f,nul){
		if(typeof dt=="string"){
			if(typeof f=="undefined"){
				f=dt;
				dt=new Date();
			}else{
			    if(this.isNumber(dt) && dt.length>11){
				   	dt=new Date(Number(dt));
				}else if(this.isNumber(dt) && dt.length==8){
					var y=dt.substr(0,4);
					var m=dt.substr(4,2);
					var d=dt.substr(6,2);
					var ymd=y+"-"+m+"-"+d;
					dt=new Date(ymd.replace(/-/g,'/'));	
				}else{
					if(dt.indexOf(".")>-1){
						dt=dt.split(".")[0];
					}
                    dt=dt.replace(/T/g,' ');
				    dt=new Date(dt.replace(/-/g,'/'));	

				}
			}
		}
		if(typeof dt=="number"){
			dt=new Date(dt);
		}
	    if(f=="date"){
	    	return dt;
	    }
		var week=["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
		if(dt && f!=""){
		     var y=dt.getFullYear(),
			     m=this.length2(dt.getMonth()+1),
				 d=this.length2(dt.getDate()),
				 h=this.length2(dt.getHours()),
				 hh=dt.getHours(),
				 i=this.length2(dt.getMinutes()),
				 s=this.length2(dt.getSeconds()),
				 l=dt.getMilliseconds(),
				 week=week[dt.getDay()];
			
			f=f.replace(/y/g,y);
			f=f.replace(/m/g,m);
			f=f.replace(/d/g,d);
			f=f.replace(/h1/g,hh);
			f=f.replace(/h/g,h);
			f=f.replace(/i/g,i);
			f=f.replace(/s/g,s);
			f=f.replace(/l/g,l);
			
			f=f.replace(/week/g,week);
			
			return f;
		}
		return nul==true?"":false;
	},
    alert:function(str,yes,title){
        if(!$("#alert_dialog")[0]){
            var dom='<div class="modal-content red"  id="alert_dialog" style="width:500px; display: none;">';
            dom+='<div class="modal-header">';
            dom+='<button type="button" class="close" id="alert_dialog_btn_close"><span aria-hidden="true">×</span><span class="sr-only">关闭</span></button>';
            dom+='<h4 class="modal-title" id="alert_dialog_title">日志</h4>';
            dom+='</div>';
            dom+='<div class="modal-body" style="max-height: 500px;overflow-y:auto;font-size: 16px;" id="alert_dialog_body">';
            //dom='您确定要删除数据吗？';
            dom+='</div>';
            dom+='<div class="modal-footer">';
            dom+='<a class="btn btn-success hidden-print" id="alert_dialog_yes">确定</a>';
            dom+='</div>';
            dom+='</div>';
            $("body").append(dom);
            $("#alert_dialog").popup({
                vertical:"center",
                "blur":true,
                transition: 'all 0.3s'
            });
            $("#alert_dialog_btn_close").bind("click",function(){
            	$('#alert_dialog').popup("hide");
            	return false;
            });
            $('#alert_dialog_yes').bind("click",function(){
                $('#alert_dialog').popup("hide");
                if(typeof ehi.alert_yes=="function"){
                    ehi.alert_yes();
                }
                return false;
            });
        }

        ehi.alert_yes=yes;
        $("#alert_dialog_body").html(str);
        if(typeof title!="string"){
            title="车辆管理系统";
        }
        $("#alert_dialog_title").html(title);
        $('#alert_dialog').popup("show");
        return false;

	},
    confirm:function(str,yes,no,title){
		if(!$("#confirm_dialog")[0]){
            var dom='<div class="modal-content blue"  id="confirm_dialog" style="width:500px; display: none;">';
            dom+='<div class="modal-header">';
            dom+='<button type="button" class="close" id="confirm_dialog_btn_close"><span aria-hidden="true">×</span><span class="sr-only">关闭</span></button>';
            dom+='<h4 class="modal-title" id="confirm_dialog_title">日志</h4>';
            dom+='</div>';
            dom+='<div class="modal-body" style="max-height: 500px;overflow-y:auto; font-size: 16px;" id="confirm_dialog_body">';
            //dom='您确定要删除数据吗？';
            dom+=' </div>';
            dom+='<div class="modal-footer">';
            dom+='<button type="button" class="btn btn-default" id="confirm_no">取消</button>';
            dom+='<a class="btn btn-success hidden-print" id="confirm_yes">确定</a>';
            dom+='</div>';
            dom+='</div>';
            $("body").append(dom);
            $("#confirm_dialog").popup({
                vertical:"center",
                "blur":true,
                transition: 'all 0.3s'
            });
            $("#confirm_dialog_btn_close").bind("click",function(){ $('#confirm_dialog').popup("hide");return false;});
            $('#confirm_no').bind("click",function(){
                $('#confirm_dialog').popup("hide");
                if(typeof ehi.confirm_no=="function"){
                    ehi.confirm_no();
				}
                return false;
            });
            $('#confirm_yes').bind("click",function(){
                $('#confirm_dialog').popup("hide");
                if(typeof ehi.confirm_yes=="function"){
                    ehi.confirm_yes();
                }
                return false;
            });
		}
		ehi.confirm_yes=yes;
        ehi.confirm_no=no;
		$("#confirm_dialog_body").html(str);
		if(typeof title!="string"){
            title="车辆管理系统";
		}
        $("#confirm_dialog_title").html(title);
        $('#confirm_dialog').popup("show");
	}


};

$(function(){
    $.fn.topZindex=function(){
        var p=this.parent().children(),zi=0,tp=0,regNum =/^\d{1,10}$/;
        p.each(function(index,element){
            tp=$(element).css("z-index");
            if(regNum.test(tp)){
                tp=Number(tp);
                if(tp>zi){zi=tp;}
            }
        });
        this.css("z-index",zi+1);
        return this;
    };
})
