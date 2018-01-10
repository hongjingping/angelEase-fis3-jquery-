(function(){
	var ModifyPhReal = {
	        init: function () {
	            this.renderCommonTitle();
	        },

	        renderCommonTitle: function () {
	            $('#cmn-header').text('修改手机号码');
	        }
	    };
	ModifyPhReal.init();
	checkUserLogin();
    $.ajax({
        url: host+"user/checkChangeMobileRealName.htm",
        contentType: "application/x-www-form-urlencoded;charset=utf-8",
        dataType: "json",
        type: "post",
        data: token_client_data,
        success: function (data) {
            if (data.code != '0000') {
                window.location.href = baseUrl+"mphone/stepone.html";
            }
        }
    });
    $("#nextBtn").on("click", function () {
    	if($("input[name='realName']").val()==''||$("input[name='realName']").val()==undefined){
       	 $(".error-notice").attr("style","display:block");
            $("#error-txt-third").html("请填写真实姓名");
           return;
       }
       if($("input[name='idCardNo']").val()==''||$("input[name='idCardNo']").val()==undefined){
       	 $(".error-notice").attr("style","display:block");
            $("#error-txt-third").html("请填写证件号码");
           return;
       }

       var url = host+"user/changeMobile2.htm";
       var data = "idCardNo=" + $.base64.encode($("input[name='idCardNo']").val())+"&realName=" + $("input[name='realName']").val();
       data += "&clientType=pc&token="+getToken(),
       $.ajax({
           url: url,
           contentType: "application/x-www-form-urlencoded;charset=utf-8",
           dataType: "json",
           type: "post",
           data: data,
           success: function (data) {
               if (data.code == '0000') {
                   window.location.href = baseUrl+"mphone/steptwo.html";
               } else {
                   if(data.desc.indexOf('上一步')>=0)
                   window.location.href = baseUrl+"mphone/stepone.html";
                   $(".error-notice").attr("style","display:block");
                   $("#error-txt-third").html(data.desc);
               }

           }
       });
    });
})();