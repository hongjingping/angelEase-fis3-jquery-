var leftInput=false;
var rightInput=false;

(function () {

    var req = getRequest();
    var orderId = req.orderId;
    var encodeStr = req.encodeStr;
    var idcardType;
    var Common = {
        init: function () {
            this.setHeader();
        },
        setHeader: function () {
            $('.cmn-header-title').text('签约页');
            $('.cmn-header').find('.cmn-arrow-back').css('display', 'none');
        }
    };

    Common.init();

    // 初始方法 获取身份证图片
    function init(token_client_data_pc) {
        $.ajax({
            type: 'POST',
            url: host + '/order/signature.htm?orderId=' + orderId,
            data: token_client_data_pc,
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

    // 判断是重签还是签约，设置Header部分的名字
    function setHeaderText(token_client_data_pc) {
        $.ajax({
            type: 'POST',
            url: host + 'order/getOrderStatus.htm?orderId=' + orderId,
            data: token_client_data_pc,
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

    // 扫描pc二维码 做登录动作
    $.ajax({
        url: host + 'sig/doLogin.htm',
        type: 'post',
        dataType: 'json',
        data: {'orderId': orderId,'encodeStr': encodeStr,'clientType': 'wap'},
        async: false,
        success:function (data) {
            if (data.code == '0000') {
                setToken(data.data);
                var token_client_data_pc = {'token':data.data,'clientType':'wap'};
                token_client_data = token_client_data_pc;
                setHeaderText(token_client_data_pc);
                init(token_client_data_pc);
                checkOrderIdUser(orderId);
            } else if (data.code == '9999') {
                new SmartToast({
                    content: data.desc,
                    type: 'warn',
                    duration: 3
                });
            }
        },error:function (e) {
        }
    });

    rejectInfo(orderId);

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
        window.location.href = baseUrl + "invest_sign/sign-pc.html?orderId=" + orderId;
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
