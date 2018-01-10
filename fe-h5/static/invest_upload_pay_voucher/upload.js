(function () {

	var Common = {
		init: function () {
			this.setHeader();
		},

		setHeader: function () {
			$('.cmn-header-title').text('下单页');
		}
	};

	function getImageBase64(file) {
        var fr = new FileReader();
        return new Promise(function (resolve) {
          fr.onload = function () {
            resolve(fr.result);
          };
          fr.readAsDataURL(file);
        });
    }
	
    var success = {
	        init: function () {
	            this.cacheElements();
	            this.bindEvents();
	        },
	        cacheElements: function() {
	            this.uploadInput = $('.upload-left-pic input[type=file]');
	        },
	        bindEvents: function() {
	            this.uploadInput.on('change', this.uploadAvatar.bind(this));
	        },
	        uploadAvatar: function(e) {
	            if (e.target && e.target.files && e.target.files[0]) {
	                var blob = e.target.files[0];
                    if(!/image\/\w+/.test(blob.type)){
                        new SmartToast({
                            content: '请确保文件为图像类型',
                            type: 'warn',
                            duration: 3
                        });
                        return false;
                    }
	                getImageBase64(blob).then(function(src) {
	                    var uploadFlag = reduceImg(src,2,orderId);
	                    if(uploadFlag){
	                    	$('#frontImg').attr('src',src);
	                    }
	                });
	            }
	        }
	    };

	success.init();
	
	Common.init();

	checkUserLogin();

    checkUserStatus();
    
    var req = getRequest();
    var orderId = req.orderId;

    checkOrderIdUser(orderId);

    $("#upload").click(function () {
        var imgStr = $('#frontImg').attr('src');
        if (imgStr == '' || imgStr == null || imgStr == undefined) {
            new SmartToast({
                content: '请请选择要上传的图片',
                type: 'warn',
                duration: 3
            });
            return;
        }  

        var paramData = {"orderId": orderId};
        var wholeData = extend(paramData, token_client_data, {});
        $.ajax({
            type: 'POST',
            url: host + 'invest/doUploadPaySuccess.htm',
            data: wholeData,
            dataType: 'JSON',
            success: function (data) {
                if (data.code == '0000'){
                    new SmartToast({
                        content: data.desc,
                        type: 'success',
                        duration: 3
                    });
                    location.href = 'upload-suc.html?orderId=' + orderId;
                } else if (data.code == '4000') {
                    location.href = loginUrl;
                } else if (data.code == '5000') {
                    location.href = '/page/index';
                }else{
                    new SmartToast({
                        content: data.desc,
                        type: 'warn',
                        duration: 3
                    });
                }
            },error:function(e){
            }
        });
    });
})();
