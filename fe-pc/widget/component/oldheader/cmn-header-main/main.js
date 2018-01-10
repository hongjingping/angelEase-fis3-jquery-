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

            	  //查询当前用户信息
			    $.ajax({
			        url: host + "/user/auth/selectShowName.htm",
			        contentType: "application/x-www-form-urlencoded;charset=utf-8",
			        dataType: "json",
			        type: "post",
			        data: token_client_data,
			        success: function (data) {
			            if (data.code == '0000') {
			                if (data.data.type == '1') {
			                    $('#realName').html('**' + data.data.name.substring(data.data.name.length - 1, data.data.name.length));
			                } else if (data.data.type == '2') {
			                    $('#realName').html(data.data.name);
			                } else if (data.data.type == '3') {
			                    $('#realName').html(data.data.name);
			                }
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