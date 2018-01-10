(function(){
	var isrealname = false;
	var islogin = false;
	var apmobile;
	var apName;
	var activeCode;
	var token;
	var iscansend = true;
	var passtime = 60;
	var acmsgtime = passtime;
	
	$("#sendCode").click(function(){
 		sendmsg();
	});
	$("#ac-imgcode-src").click(function(){
		reimg();
	});
	
	$("#ac-form-sub").click(function(){
		if(!isrealname){
			apName = $("#apName-s").val();
		}
		if(!islogin){
			apmobile = $("#apMobile-s").val();
		}
		formsubmit();
	});
	$("#toastBox").click(function() {
	    $('#toastBox').hide();
	});
	
	acinit();
	
	function acinit(){
		activeCode = getRequest()['activeCode'] ;
		$("#ac-openid").val( getRequest()['openId']);
		token=getToken();
		//加载图片验证码
		var openid= getRequest()['openId'];
		$("#ac-imgcode-src").attr('src',host+'/ac/active/picCode.htm?width=75&height=40&rnd=' + Math.random()+"&clientType=wap&openId="+openid); 
	};
	
	
	$.ajax({
			url: host+'/ac/active/info.htm',
	         type: "post",
	         data:{'token':getToken(),'clientType':'wap', activeCode: activeCode,openId:$("#ac-openid").val(),isSgin:true},
	         dataType:"json", 
	         success:function(data){
	        	 $("#ac-apactiveid").val(data.data.active.activeId);
	        	 if(null != data.data.active.acImg){
		        	 	var acimg = staticUrl+data.data.active.acImg;
		        	 	$("#acimg").attr('src',acimg);
		        }	        
	         },
	         error:function(){
	        	 iscansend=true;
	         }
		});
		
		//发送短信验证码
		function sendmsg(){
			if(!checkform()){
				return ;
			} ;
			var imgCodeshow = $("#label-code-img").css('display'); 
			if('none' == imgCodeshow){
				reimg();
				$("#label-code-img").show();
				return ;
			};
			if(!checknum($('#ac-imgCode').val())){
			message('请正确输入图形验证码');
			return ;
			};
			if(!iscansend)
				return;
			var _this =$("#sendCode");
			$.ajax({
				url: host+'/ac/active/sendmsg.htm',
		         type: "post",
		         data:{'token':getToken(),'clientType':'wap', apMobile: apmobile, apActiveId: $("#ac-apactiveid").val(),openId:$("#ac-openid").val(),imgCode:$("#ac-imgCode").val(),isSgin:true},
		         dataType:"json", 
		         success:function(data){
		        	 if('0000'==data.code){
	        			 if('ok'==data.data.code){
	        			 	//发送成功
	        			 	iscansend=false;
							t=setInterval(function () {
								if(passtime>0){
									_this.html(passtime+'秒');
									_this.addClass("disabled");
									passtime--;
								} else{
									clearInterval(t);
									_this.html("重新获取").removeClass("disabled");
									iscansend=true;
									passtime=acmsgtime;
								}
								 
							},1000)
	        			 }else{
	        			 	// if(data.data.times>3){
	        				 // $("#label-code-img").show();
	        				 // reimg();
	        			 	// }
	        			 	iscansend = true;
	        			 	message(data.data.msg);
	        			 }
		        	  	
		        	 }else{
		        	 	iscansend = true;
		        	 	message(data.desc);
		        		 
		        	 }
		         },
		         error:function(){
		        	 iscansend=true;
		         }
			});
	};

	function formsubmit(){
		if(!checkform()){
			return ;
		}
		if(!checknum($('#ac-mobilecode').val())){
			message('请正确输入短信验证码');
			return ;
		};
		var agr = $("#i-check-btn").hasClass('i-check-checked');
		if(!agr){
			message('请选择投资人声明');
			return false;
		};
		$.ajax({
			url: host+'/ac/active/update.htm',
            type: "post",
            data:{'token':getToken(),'clientType':'wap', apMobile: apmobile, apActiveId: $("#ac-apactiveid").val(),apOpenid:$("#ac-openid").val(),mobileCode:$("#ac-mobilecode").val(),apName:apName,isSgin:true},
            dataType:"json", 
            success:function(data){
            	if('0000'==data.code){
            		if('ok'!=data.data.code){
            			message(data.data.msg);
            		}else{
            			window.location.href="/page/roadshow_enroll/add-enroll-success.html?apId="+data.data.apId;
            		};
            		
            	}else{
            		message(data.data.msg);
            	}
            },
            error:function(){

            }
		});

	};

	function checkform(){
			parmfull();
			if(trim(apName)=='' ){
		    	message('请正确输入姓名');
				return false;
			};
			if(!validatemobile(apmobile) ){
				message('请正确输入手机号码');
				return false;
			};
			return true;
	};

	function reimg(){  
           $("#ac-imgcode-src").attr('src',host+'/ac/active/picCode.htm?width=75&height=40&rnd=' + Math.random()+"&clientType=wap&openId="+$("#ac-openid").val());  
           $('#sms_code_div').hide();   
    };

     function parmfull(){
		apName = $("#apName-s").val();
		apmobile = $("#apMobile-s").val();
	 };

})()

function checkPicCode(value){
	if(value.length != 4){
		$('#sms_code_div').hide();
		return false;
	}
	if(value.length == 4){
		$.ajax({
			 url: host+'/ac/active/checkPicCode.htm',
	         type: "post",
	         data:{'token':getToken(),'clientType':'wap',openId:$("#ac-openid").val(),imgCode:$("#ac-imgCode").val()},
	         dataType:"json", 
	         success:function(data){
	        	 if('0000'==data.code){
        			 if('ok'==data.data.code){
        				 $('#sms_code_div').show();
        			 }else{
        				 $('#sms_code_div').hide();
        				 message(data.data.msg);
        			 }
	        	 }
	         }
		});
	}
}