(function () {

	var DetailMessage = {
		init: function () {
			this.detailMessageHeader();
		},

		detailMessageHeader: function () {
			$('.cmn-header-title').text('消息详情');
		}
	};

	DetailMessage.init();

	checkUserLogin();
	//消息详情查询
	var req = getRequest(); 
	var msgId = req.msgId;
	var url = host + 'mmessage/getPCMessage.htm?msg_id='+msgId;
	$.ajax({
		url: url,
		dataType: "JSON",
		type: "POST",
		data:token_client_data,
		async:false,
		success: function (result) {
			if(result.code == '0000'){
				$("#message_name").html(result.data.model.msgName);
				$("#send_time").html(result.data.model.msgDate);
				$("#message_content").html(result.data.model.msgContent.replace("xxx",result.data.userName));

			}else if(result.code == '4000'){
                location.href = loginUrl;
            }
		},
		error:function(e) {
		}
	});
})();