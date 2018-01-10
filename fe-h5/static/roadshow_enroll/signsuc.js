(function(){
	var apId;
	function acinit(){
		apId = getRequest()['apId'] ;
		var acimg = getRequest()['acimg'] ;
		if (acimg !== null || acimg !== undefined || acimg !== '') {
			//$("#acimg").attr("src",acimg);
		}
	}
	acinit();
	$.ajax({
			url: host+'/ac/active/success.htm',
	         type: "post",
	         data:{'token':getToken(),'clientType':'wap', apId: apId},
	         dataType:"json", 
	         success:function(data){
	        	 if('0000'==data.code){
	        	 	$("#username").html(data.data.apName);
	        	 	$("#phone").html(data.data.apMobile);
	        	 	$("#project-name").html(data.data.acName);
	        	 	$("#acimg").attr("src",staticUrl+data.data.acImg);
	        	 }else if (data.code == '4000'){
                    location.href = loginUrl;
                 }
	        	 		        
	         },
	         error:function(){
	        	 
	         }
		});
		
})()