var leftInput=false;
var rightInput=false;

(function () {

    var req = getRequest();
    var orderId = req.orderId;
    var proId = req.proId;
    var proinveseId = req.proinveseId;
    checkUserLogin();

    checkUserStatus();

    checkOrderIdUser(orderId);

	var Common = {
		init: function () {
			this.setHeader();
		},

		setHeader: function () {
            $.ajax({
                type: 'POST',
                url: host + 'order/getOrderStatus.htm?orderId=' + orderId,
                data: token_client_data,
                dataType: 'JSON',
                success: function(data) {
                    if (data.code == "0000") {
                        if(data.data == '6'){
                            tempStatus = data.data;
                            $('.cmn-header-title').text('重签');
                        } else {
                            $('.cmn-header-title').text('签约页');
                        }
                    }
                },
                error: function(e) {
                }
            });
		}
	};

	Common.init();

    rejectInfo(orderId);

    function init() {
        $.ajax({
            type: 'POST',
            url: host + '/order/signature.htm?orderId=' + orderId,
            data: token_client_data,
            dataType: 'JSON',
            success: function(result) {
                if (result.code == '0000') {
                    if (result.data.certifyImgs != '') {
                        if (result.data.certifyImgs.frontImg != '') {
                            $("#cardImgFrontId").attr("src", staticUrl + result.data.certifyImgs.frontImg);
                        }
                        if (result.data.certifyImgs.reverseImg != '') {
                            $("#cardImgBackId").attr("src", staticUrl + result.data.certifyImgs.reverseImg);
                        }
                        $("#nextButtom").attr("class","next-btn")
                    }
                } else if (result.code == '4000') {
                    window.location.href = loginUrl;
                }
            },
            error: function(e) {
            }
        });
    }

    init();

    // 点击下一步  保存身份证正反面数据
    $(".btn-wrapper").click(function() {

        var cardImgFront = $("#cardImgFrontId").attr("src");
        var cardImgBack = $("#cardImgBackId").attr("src");

        if (cardImgFront == '' || cardImgFront == null || cardImgFront == undefined || cardImgFront.indexOf('/resource/images/IDcard') > -1) {
            new SmartToast({
                content: '请选择身份证正面照片',
                type: 'warn',
                duration: 3
            });
            return;
        }

        if(cardImgFront.indexOf(staticUrl) == -1 && cardImgFront.length >= 2801747){
            new SmartToast({
                content: '请选择2M以内的身份证正面上传',
                type: 'warn',
                duration: 3
            });
            return;
        }

        if (cardImgBack == '' || cardImgBack == null || cardImgBack == undefined || cardImgBack.indexOf('/resource/images/IDcard') > -1) {
            new SmartToast({
                content: '请选择身份证背面照片',
                type: 'warn',
                duration: 3
            });
            return;
        }

        if(cardImgBack.indexOf(staticUrl) == -1 && cardImgBack.length >= 2801747){
            new SmartToast({
                content: '请选择2M以内的身份证背面上传',
                type: 'warn',
                duration: 3
            });
            return;
        }
        window.location.href = baseUrl + "invest_sign/agree.html?orderId=" + orderId + '&proId=' + proId + '&proinveseId=' + proinveseId;
    })

    /**
     * 将图片转为base64格式
     * @private
     */
    function getImageBase64(file) {
        var fr = new FileReader();
        return new Promise(function(resolve) {
            fr.onload = function() {
                resolve(fr.result);
            };
            fr.readAsDataURL(file);
        });
    }

    var buttonFlag = false;

    var editProfile = {
        uploading:false,
        init: function() {
            this.cacheElements();
            this.bindEvents();
        },
        cacheElements: function() {
            this.uploadInputFront = $('.upload-left input[type=file]');
            this.uploadInputBack = $('.upload-right input[type=file]');
        },
        bindEvents: function() {
            this.uploadInputFront.on('change', this.uploadAvatarFront.bind(this));
            this.uploadInputBack.on('change', this.uploadAvatarBack.bind(this));
        },
        uploadAvatarFront: function(e) {
            if(this.uploading) {
              new SmartToast({
                  content: '上传中,请勿重复提交',
                  type: 'warn',
                  duration: 3
              });
              return;
            }

            if (e.target.files[0].size >= 2801747) {
                new SmartToast({
                    content: '请选择2M以内的图片',
                    type: 'warn',
                    duration: 3
                });
                return;
            }

            var formData = new FormData();
            formData.append('file', e.target.files[0]);

            this.uploading = true;
            var _this = this;
            $.ajax({
                 url : host+'upload/uploadImgs.htm?type=3&clientType=wap&token=' + getToken(),
                 type : 'POST',
                 data : formData,
                 processData: false,  // tell jQuery not to process the data
                 contentType: false,  // tell jQuery not to set contentType
                 success : function(data) {
                   var data = JSON.parse(data);
                   _this.uploading = false;
                   if(data.code === '0000'){
                     $('#cardImgFrontId').attr('src',data.data);
                   }
                 }
            });

            /*
            if (e.target && e.target.files && e.target.files[0]) {
                var blob = e.target.files[0];
                getImageBase64(blob).then(function(src) {
                	var uploadFlag = reduceImg(src,3,'');
                	if(uploadFlag){
                		$('#cardImgFrontId').attr('src',src);
                	}
                    if(buttonFlag){
                        $("#nextButtom").attr("class","next-btn")
                    }else{
                        buttonFlag = true;
                    }

                });
            }
            */

        },
        uploadAvatarBack: function(e) {

            if(this.uploading) {
              new SmartToast({
                  content: '上传中,请勿重复提交',
                  type: 'warn',
                  duration: 3
              });
              return;
            }


            if (e.target.files[0].size >= 2801747) {
                new SmartToast({
                    content: '请选择2M以内的图片',
                    type: 'warn',
                    duration: 3
                });
                return;
            }

            var formData = new FormData();
            formData.append('file', e.target.files[0]);
            this.uploading = true;
            var _this = this;
            $.ajax({
                 url : host+'upload/uploadImgs.htm?type=4&clientType=wap&token=' + getToken(),
                 type : 'POST',
                 data : formData,
                 processData: false,  // tell jQuery not to process the data
                 contentType: false,  // tell jQuery not to set contentType
                 success : function(data) {
                   var data = JSON.parse(data);
                   _this.uploading = false;
                   if(data.code === '0000'){
                     $('#cardImgBackId').attr('src',data.data);
                   }
                 }
            });

        }
    }
    editProfile.init();
})();
