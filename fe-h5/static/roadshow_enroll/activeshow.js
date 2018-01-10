(function (){
		var isrealname = false;
		var islogin = false;
		var apmobile;
		var apName;
		var iscansend = true;
		var activeCode;//活动编码
		var iscansend = true;
		var passtime = 60;//短信验证码过期时间
		var acmsgtime = passtime;
		checkUserLogin();

		$("#sendCode").click(function(){
	 		sendmsg();
		});

		$("#ac-form-sub").click(function(){
			parmfull();
			formsubmit();
		});
		$("#toastBox").click(function() {
		    $('#toastBox').hide();
		});


		function parmfull(){
			if(!isrealname){
				apName = $("#apName-s").val();
			}
			if(!islogin){
				apmobile = $("#apMobile-s").val();
			}
		 };

		function acinit(){
			activeCode = getRequest()['activeCode'] ;
			$("#ac-openid").val( getRequest()['openId']);

		};


		acinit();
		$.ajax({
				url: host+'/ac/active/info.htm',
		        type: "POST",
		        data:{'token':getToken(),'clientType':'wap', activeCode: activeCode,openId:$("#ac-openid").val()},
		        dataType:"json", 
		        success:function(data){
					console.log(JSON.stringify(data));

					if (data.code == '0000'){
				        	 $("#project-name").html(data.data.active.acName);
				        	 $("#address").html(data.data.active.acPlace);
				        	 $("#sponsor").html(data.data.active.acHost);
				        	 $("#register-count").html(data.data.count);
				        	 $("#register-num").html("/"+data.data.active.acNumber);
				        	 $("#time").html(''+data.data.active.acStartTime);
				        	 $("#ac-apactiveid").val(data.data.active.activeId);
				        	 if(null != data.data.active.acImg){
				        	 	var acimg = staticUrl+data.data.active.acImg;
				        	 	$("#acimg").attr('src',acimg);
				        	 }
				        	  if(data.data.user!=null){
								  console.log(123);
								  apmobile = data.data.user.mobile;
					        	  	if(data.data.user.relName){
					        	  		var relName = data.data.user.relName;
					        	  		$("#apName-p-h").html('***'+relName.substring(relName.length-1,relName.length));
					        	  		$("#apName-h").html(relName);
									 	$("#ac-ap-name-h").show();
									 	isrealname=true;
									 	apName=relName;
									 	 
					        	  	}else{
					        	  		$("#ac-ap-name-s").show();
					        	  	}
									if(null != (data.data.user.mobile)){
										var mobile = data.data.user.mobile;
										$("#apMobile-p-h").html(mobile.substring(0,3)+'****'+mobile.substring(mobile.length-4,mobile.length));
									 	islogin=true;
									}
									
				        	  }else{
				        	  		$("#ac-ap-name-s").show();
				        	  		$("#ac-ap-mobile-s").show();
				        	  }
			        	}else if (data.code == '4000'){
	                   		 location.href = loginUrl;
	               		}
		        
		         },
		         error:function(){
		        	 iscansend=true;
		         }
			});
			
			
		function formsubmit () {
			checkUserLogin();
			if(!checkform()){
				return ;
			};
			$.ajax({
				url: host+'/ac/active/update.htm',
	            type: "post",
	            data:{'token':getToken(),'clientType':'wap', apMobile: apmobile, apActiveId: $("#ac-apactiveid").val(),apOpenid:$("#ac-openid").val(),mobileCode:$("#ac-mobilecode").val(),apName:apName},
	            dataType:"json", 
	            success:function(data){
	            	if('0000'==data.code){
	            		if('ok'!=data.data.code){
							new SmartToast({
								content: data.data.msg,
								type: 'warn',
								duration: 2
							});
	            			//message(data.data.msg);
	            		}else{
	            			window.location.href="/page/roadshow_enroll/realname-cert-success.html?apId="+data.data.apId;
	            		};
	            	}else if (data.code == '4000'){
                   		 location.href = loginUrl;
                	}else{
						new SmartToast({
							content: data.data.msg,
							type: 'warn',
							duration: 2
						});
	            		//message(data.data.msg);
	            	}
					 
	            },
	            error:function(){

	            }
			});

		};

		function checkform () {
				parmfull();
				if(trim(apName).length<1){
					new SmartToast({
						content: '请正确输入姓名',
						type: 'warn',
						duration: 2
					});
					//message('请正确输入姓名');
					return false;
				}
				/*
				if(!isChinese(apName) ){
					alert('请正确输入姓名');
					return false;
				};
				*/
				if(!validatemobile(apmobile) ){
					new SmartToast({
						content: '请正确输入手机号码',
						type: 'warn',
						duration: 2
					});
					//message('请正确输入手机号码');
					return false;
				}
				var agr = $("#i-check-btn").hasClass("i-check-checked");
				if(!agr){
					new SmartToast({
						content: '请选择投资人声明',
						type: 'warn',
						duration: 2
					});
					//message('请选择投资人声明');
					return false;
				};
				return true;
		};
		 
	}
	
)()