(function () {

	var Message = {
		init: function () {
			this.messageHeader();
		},

		messageHeader: function () {
			$('.cmn-header-title').text('我的消息');
		}
	};

	Message.init();

	//业务
	checkUserLogin();

	//消息查询
	$.ajax({
		url: host + 'mmessage/getMessage.htm',
		dataType: "JSON",
		type: "POST",
		data:token_client_data,
		success: function (result) {
			if(result.code == '0000'){
				if(result.data.modelList.length > 0){
					var contentHtml ='<div class="#titleCss#">' +
										'<div class="content-line1">' +
											'<span class="#contentCss#">宜信众筹</span>' +
											'<span class="#contentDate#">#date#</span>' +
										'</div>' +
										'<div class="content-line2" onclick="document.location=\'detail-message.html?msgId=#id#\'">' +
											'<span class="content-info">#title#</span>' +
											'<a class=" message-info"><i class="ae-mobile ae-mobile-arrow-right"></i></a>' +
										'</div>' +
											//'<a class="message-info"><i class="ae-mobile ae-mobile-arrow-right"></i></a>' +
									'</div>';
					var newHtml = '';
					$.each(result.data.modelList , function (index,element){
						newHtml = contentHtml.replace('#title#', '【系统消息】' + element.msgName).
									replace('#date#', element.msgDate).
									replace('#id#', element.msgId);
						if(element.isRead == '1'){
							newHtml = newHtml.replace('#titleCss#', 'input-list-common input-list').replace('#contentCss#','content-title').replace('#contentDate#','content-date');
						}else{
							newHtml = newHtml.replace('#titleCss#', 'input-list-common input-list-white').replace('#contentCss#','content-title-gray').replace('#contentDate#','content-date-line3');
						}
						$('.list').append(newHtml);

					});
					//$('.input-list-common').on('touchstart',function(){
					//	$(this).css('background','red');
					//})

				}else {
					window.location.href = '/page/message/empty-message.html';
				}
			}else if(result.code=='4000'){
				window.location.href = loginUrl;
            }
		}
	});



})();