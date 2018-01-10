(function () {
	var projectId = getRequest()['projectId'] ;
	//$('#qrcode').attr('src',host+'/ac/active/qrcodebypid.htm?width=176&projectId='+projectId)
	var Roadshow = {
		init: function () {
			$.ajax({
				url: host+'/ac/active/infobypid.htm',
		        type: "post",
		        data:{'token':getToken(),'clientType':'pc', projectId: projectId,openId:$("#ac-openid").val()},
		        dataType:"json",
		        success:function(data){
		         	 if (data.code == '0000'){
				        	 $("#project-name").html(data.data.active.acName);
				        	 $("#address").html(data.data.active.acPlace);
				        	 $("#sponsor").html(data.data.active.acHost);
				        	 $("#register-num").html(data.data.count+'/'+data.data.active.acNumber+"人");
				        	 $("#time").html(data.data.active.acStartTime);
				        	 $("#ac-apactiveid").val(data.data.active.activeId);
				        	 $("#acinfo").html(data.data.active.acInfo);
				        	 if(null != data.data.active.acImgPc){
				        	 	var acimg =staticUrl+data.data.active.acImgPc;
				        	 	$("#acimg").css("background-image",'url('+acimg+')');
				        	 }
				        	 var qrcode = new QRCode(document.getElementById("qrcode-div"),{
											width: 120,
											height: 120,
											colorDark : "#000000",
											colorLight : "#ffffff",
											correctLevel : QRCode.CorrectLevel.H
											});
						 		qrcode.makeCode( host+"/wx/activity/index.htm?activeCode="+data.data.active.acCode);
			        	}

		         },
		         error:function(){

		         }
			});
		},

		showQrcode: function () {
			var me = this;
			$('.show-qrcode').css('top', $('.show-nav').outerHeight() + 'px');

			$(window).on('resize scroll', function () {
				if (!($(window).scrollTop() > $(window).outerHeight())) {
					$('.show-qrcode').css('top', me.qrcodeHeight + $(window).scrollTop() + 'px');
				}
			});
		}
	};

	Roadshow.init();
})();