(function () {
	// write code here
	var HeaderMain = {
		init: function () {
			$.ajax({
		        type: 'POST',
		        url: host + 'user/checkUserLogin.htm',
		        dataType: 'JSON',
		        data:{'token':getToken(),'clientType':'pc'},
		        async: false,
		        success: function (data) {
		            if(data.code == '0000'){
		                $('.cmn-btn-gold-w12').css('display', 'inline-block');
		                showHasLogin();
		            }else{
		                $('.cmn-btn-gold-w6').css('display', 'inline-block');
		                $('.cmn-btn-gray-w6').css('display', 'inline-block');
		            }
		        }, error:function(e){
		        	var readSmartAlert = new SmartAlert({
                	    title: 'error',
                	    content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">'+e.responseText+'</span>',
                	    type: 'confirm',
                	    okText: '我知道了',
                	    maskClosable: false,
                	});
                	readSmartAlert.open();
		        }
		    });
			function showHasLogin(){
				//显示昵称 和 安全退出按
				$('#realName').show();
            	$('#logOut').show();
			    //获取实名
				$.ajax({
			        type: 'POST',
			        url: host + 'user/auth/realNameResult.htm',
			        dataType: 'JSON',
			        data:token_client_data,
			        success: function (data) {
			        	if(data.code == '0000'){
		            		//实名认证成功的
		            		var length = data.data.realName.length;
		            		$('#realName').text('**'+data.data.realName.substring(length-1));
			            }else if(data.code == '9999'){
			            	var length = data.data.mobile.length;
			        		$('#realName').text(data.data.mobile.substring(0,3)+'*******'+data.data.mobile.substring(length-3));
			            }
			        }
			    });
			}

			//退出事件
			$('#logOut').on('click',function(){
				var readSmartAlert = new SmartAlert({
				    title: '安全退出',
				    content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">确定退出吗？</span>',
				    // type: 'confirm',
				    okText: '确定',
				    onOk: function () {
				    	$.ajax({
					        url: host + "user/logout.htm",
					        contentType: "application/x-www-form-urlencoded;charset=utf-8",
					        dataType: "json",
					        type: "post",
					        data: "clientType=pc&token=" + getToken(),
					        success: function (data) {
					            if (data.code == '0000') {
					                clearToken();
					                window.location.href = "/page/home/home.html";
					            } else {
					                $("#error").html(data.desc)
					            }
					        }
					    });
				    },
				     maskClosable: false,
				});
				readSmartAlert.open();
			});
		}

	};

	HeaderMain.init();

})();