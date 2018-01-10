(function(){
	var token ;
	var apId ;
	
	checkUserLogin();
	
	function acinit(){
		apId = getRequest()['apId'];
		var acimg = getRequest()['acimg'];
		/*if (acimg !== null || acimg !== undefined || acimg !== '') {
			$("#acimg").attr("src",acimg);
		}*/
		token=getToken();
	}

	acinit();

	$.ajax({
			url: host+'/ac/active/success.htm',
	         type: "post",
	         data:{'token':getToken(),'clientType':'wap', apId: apId},
	         dataType:"json", 
	         success:function(data){
	        	 if('0000'==data.code){
	        		var relName = data.data.apName;
	        	 	$("#username").html('您的姓名：'+'***'+relName.substring(relName.length-1,relName.length));
	        	 	var mobile = data.data.apMobile;
	        	 	$("#phone").html('手机号码：'+mobile.substring(0,3)+'****'+mobile.substring(mobile.length-4,mobile.length));
	        	 	$("#project-name").html(data.data.acName);
	        	 	if(null != data.data.acImg){
		        	 	var acimg =staticUrl+data.data.acImg;
		        	 	$("#acimg").attr("src",acimg);
			        }
	        	 	if(data.data.isreal){
	        	 		//实名认证
	        	 		$("#but-project").attr('href','/page/real_name_auth/real_name_suc.html');
	        	 		$("#but-project").html('个人信息认证');
	        	 		//$("#ac-project-but").hide();
	        	 		//$("#ac-auth-remind").show();

	        	 	}else if(data.data.investor){
	        	 		//合格投资人认证
	        	 		$("#but-project").attr('href','/page/investor_cert_part1/investor-cert-form.html');
	        	 		$("#but-project").html('合格投资人认证');
	        	 		//$("#ac-auth-remind").show();
	        	 		//$("#ac-project-but").hide();

	        	 	}else{
	        	 		$("#but-project").attr('href','/page/detail/detail.html?proId='+data.data.projectId);
	        	 		$("#but-project").html('项目详情');
	        	 	}

	        	 }else if (data.code == '4000'){
                    location.href = loginUrl;
                 }
	        	 		        
	         },
	         error:function(){
	        	 
	         }
		});
})()