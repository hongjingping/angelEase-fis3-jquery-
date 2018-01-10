(function () {

	var ChangeMobile = {
		init: function () {
			this.changeMobileHeader();
		},

		changeMobileHeader: function () {
			$('.cmn-header-title').text('更换绑定手机号');
		}
	};
    
	ChangeMobile.init();
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
        	new SmartToast({
                content: "请填写真实姓名",
                type: 'warn',
                duration: 3
            });
            return;
        }

        if($("input[name='idCardNo']").val()==''||$("input[name='idCardNo']").val()==undefined){
            new SmartToast({
               content: "请填写身份证信息",
               type: 'warn',
               duration: 3
            });
            return;
        }

        var url = host+"user/changeMobile2.htm";
        var data = "idCardNo=" + $.base64.encode($("input[name='idCardNo']").val())+"&realName=" + $("input[name='realName']").val();
        data += "&clientType=wap&token="+getToken(),
        $.ajax({
            url: url,
            contentType: "application/x-www-form-urlencoded;charset=utf-8",
            dataType: "json",
            type: "post",
            data: data,
            success: function (data) {
               if (data.code == '0000') {
                   window.location.href = baseUrl+"changemobile/changemobile3.html";
               } else {
                    if(data.desc.indexOf('上一步')>=0)
                    window.location.href = baseUrl+"changemobile/changemobile.html";
                    new SmartToast({
                        content: data.desc,
                        type: 'warn',
                        duration: 3
                    });
               }

            }
        });
    });

})();
