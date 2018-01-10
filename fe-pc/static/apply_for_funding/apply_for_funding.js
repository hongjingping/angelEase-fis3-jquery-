(function () {

    var uploadIdSeed = 0;

    var ApplyForFunding = {
        init: function () {
            this.registerHelper();
            this.createAlertSeries();
            this.cacheElements();
            this.getFinanceSampleUrl();
            this.bindEvents();
        },
        cacheElements: function () {
            this.$root = $('#apply-for-funding');
            this.$bpSample = this.$root.find('.bp-sample a');
            this.$showFormBtn = this.$root.find('.fund-btn');
            this.$form = this.$root.find('.apply-part-form');
            this.$formBtn = this.$form.find('.submit-btn');
            this.$uploaderBox = this.$form.find('.uploader-box');
            this.$uploadInput = this.$uploaderBox.find('input[name=uploader]');
            this.$finacRoundRadio = this.$form.find('#financ-round-wrapper .radio-item input[type=radio]');
            this.$validateEl = this.$form.find('.form-validate-notice');
        },
        bindEvents: function () {
            this.$showFormBtn.on('click', this.handleShowForm.bind(this));
            this.$formBtn.on('click', this.submitForm.bind(this));
            this.$uploadInput.on('change', this.handleUpload.bind(this));
            this.$finacRoundRadio.on('change', this.handleRadioSelect.bind(this));
        },
        registerHelper: function () {
            if(!('ifequal' in Handlebars.helpers)) {
                Handlebars.registerHelper('ifequal', function(a, b, opts) {
                    if (a == b) return opts.fn(this);
                    else return opts.inverse(this);
                });
            }
        },
        compileTemplate: function (selector, data) {
            return Handlebars.compile($(selector).html())(data);
        },
        redirect2Login: function () {
            window.location.href = "/page/login/login.html";
        },
        getFinanceSampleUrl: function () {
            this.$bpSample.attr('href', staticUrl + '201701/financierBook.pptx');
        },

        // scroll to apply form
        scorllToForm: function () {
            // we target both html and body because html will make scroll in Firefox works and body for other browsers.
            // Firefox places the overflow at the html level
            var bodyEl = $('body,html');
            bodyEl.animate(
                {
                    scrollTop: 850
                }, '500', 'swing');
        },
        // 检查用户是否可以申请融资，以展开申请融资表单
        handleShowForm: function () {
            var checkFinProjectAjax = $.ajax({
                type: 'POST',
                url: host + 'finPro/checkFinProject.htm',
                dataType: 'JSON',
                data:{'token':getToken(),'clientType':'pc'},
            });
            var self = this;
            checkFinProjectAjax.done(function (data) {
                if (data.code == '0000') {
                    self.showForm();
                    self.scorllToForm();
                } else if (data.code == '4000') {
                    self.redirect2Login();
                    // handleLoginTimeout();
                } else {
                    self._showApplyError(data.desc);
                }
            });
        },
        showForm: function () {
            this.$form.show();
        },
        handleRadioSelect: function (e) {
            // control the visibility of `#lastFinancing`
            var val = e.target.value;
            if (val == 4) {
                $('#lastFinancing').hide();
                $('#lastFinancing').find('input[name=lastInvestAmount]').val('');
            } else {
                $('#lastFinancing').show();
            }
        },
        // show/hide validate notice
        showValidateNotice: function (data) {
            this.$validateEl.find('.error-text').text(data);
            this.$validateEl.show();
            this.$form.on('mousedown', hideEl.bind(this));

            function hideEl () {
                this.$validateEl.hide();
                this.$form.off('click', hideEl);
            }
        },
        getFileType: function (file) {
            // MIME for different typed files
            var pdfMIME = ['application/pdf'];
            var pptMIME = ['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
            var imgMIME = ['image/jpeg', 'image/pjpeg', 'image/png'];

            // some judgements
            var isPDF = pdfMIME.indexOf(file.type) > -1;
            var isPPT = pptMIME.indexOf(file.type) > -1;
            var isImg = imgMIME.indexOf(file.type) > -1;
            var sizeOver10M = file.size > 10 * 1024 * 1024;
            var sizeOver2M = file.size > 2 * 1024 * 1024;

            // limit only one pdf/ppt
            if (isPDF || isPPT) {
                var fileList = this.getUploadedItems();
                if (fileList.pptOrPdf === 1) {
                    this.showValidateNotice('您已上传过一个PPT或PDF文件，请选择图片文件继续上传');
                    return;
                }
            }

            // return when not ppt/pdf/img
            if (!isPDF && !isPPT && !isImg) {
                this.showValidateNotice('仅支持小于10M的PPT&PDF文件或单个文件小于2M的JPG或PNG格式图片');
                return false;
            }

            // return when ppt/pdf file is over 10M
            if ((isPDF || isPPT) && sizeOver10M) {
                this.showValidateNotice('请您提交小于10M的ppt或pdf');
                return false;
            }

            // return when images file is over 2M
            if (isImg && sizeOver2M) {
                this.showValidateNotice('请您提交小于2M的图片');
                return false;
            }

            var fileType;
            if (isPDF) fileType = 'pdf';
            if (isPPT) fileType = 'ppt';
            if (isImg) fileType = 'image';
            return fileType;
        },
        handleUpload: function (e) {
            var files = e.target.files || e.dataTransfer.files;
            // return when fileList is empty
            if (!files.length) return;

            // check file before upload
            var file = files[0];
            var fileName = file.name.length > 9 ? file.name.slice(0,3) + '...' + file.name.slice(-6) : file.name;
            var fileType = this.getFileType(file);
            if (!fileType) return;

            // init a upload item object
            var uploadItem = {
                id: uploadIdSeed++,
                type: fileType,
                name: fileName,
                file: file
            };

            // load a object url for img preview
            if (fileType === 'image') {
                var objectUrl = window.URL.createObjectURL(file);

                // load a img in js to detect the image's width and height
                var imgTmp = new Image();
                imgTmp.onload = function() {
                    uploadItem.width = this.width;
                    uploadItem.height = this.height;
                }
                imgTmp.src = objectUrl;
                imgTmp = null;

                uploadItem.previewUrl = objectUrl;

                // add event listener to release object url
                // after object url used in `img`
                // besides, we use object url in `img.preview-img` too
                // but they are compiled together
                // so we can listen to `img.final-img` load event only
                var targetId = '#upload-item-' + uploadItem.id;
                $(targetId).find('img.final-img').on('load', function() {
                    window.URL.revokeObjectURL(file);
                });
            }

            // attach uploaded item before the position of upload button
            uploadItem.status = 'uploading';
            var uploadItemTpl = this.getUploadItemTpl(uploadItem);
            $(e.target).parent('.upload-item').before(uploadItemTpl);

            // determine show upload btn or not
            this.checkUploadBtnStatus();
            // this.previewImg('preview-img');

            // upload file
            var self = this;
            this.uploadFile(uploadItem)
            .then(function(data) {
                if (data.code == '4000') {
                    // window.location.href="/page/login/login.html";
                    handleLoginTimeout();
                    return;
                } else if (data.code == '0000') {
                    uploadItem.status = 'success';
                    uploadItem.url = data.data;
                    // handle upload success result
                    var targetId = '#upload-item-' + uploadItem.id;
                    // replace dom of upload item
                    var tmpl = self.getUploadItemTpl(uploadItem);
                    $(targetId).replaceWith(tmpl);
                    // bind remove event to `.delete` icon
                    $(targetId).find('.delete').on('click', function () {
                        $(targetId).remove();
                        // determine show upload btn or not
                        self.checkUploadBtnStatus();
                    });
                     // bind preview event to `.preview` icon
                    $(targetId).find('.preview').on('click', function () {
                        console.log('preview');
                        // $(targetId).find('.preview-popup').show();
                        var apopup = $('.preview-popup-' + uploadItem.id).apopup({
                            maskColor:'#000'
                        },function(){
                        });
                    });
                } else {
                    uploadItem.status = 'error';
                    uploadItem.error = data.desc;
                    // handle upload success result
                    var targetId = '#upload-item-' + uploadItem.id;
                    // replace dom of upload item
                    var tmpl = self.getUploadItemTpl(uploadItem);
                    $(targetId).replaceWith(tmpl);
                    // show uplpad error alert and bind event for remove current target
                    self._showUploadError(data.desc || '未知错误', function () {
                        $(targetId).remove();
                    });
                    self.checkUploadBtnStatus();
                }
            }, function(err) {
                self.checkUploadBtnStatus();
            });
        },
        checkUploadBtnStatus: function () {
            var fileList = this.getUploadedItems();
            if (fileList.total < 6) {
                this.$uploaderBox.show();
            } else {
                this.$uploaderBox.hide();
            }
        },
        uploadFile: function (item) {
            // prepare formData for POST
            var blob = item.file;
            var formData = new FormData;
            formData.append('file', blob);
            var xhr = new XMLHttpRequest;
            xhr.open('POST', host + 'upload/uploadProFin.htm?clientType=pc&token=' + getToken());

            // get upload result
            var promise = $.Deferred();
            xhr.onloadend = function () {
                var result = JSON.parse(this.responseText);
                if (this.status !== 200) {
                    promise.reject({
                      status: this.status,
                      data: result,
                    });
                  } else {
                    promise.resolve(result);
                }
            }

            var targetId = '#upload-item-' + item.id;
            var targetEl = $(targetId);

            // bind abort to dom for upload cancel
            if (targetEl.hasClass('uploading')) {
                var self = this;
                targetEl.find('.cancel-upload').on('click', function () {
                    xhr.abort(); // cancel request
                    targetEl.remove(); // remove current elements
                    // determine show upload btn or not
                    self.checkUploadBtnStatus();
                });
            }

            // get progress
            xhr.upload.onprogress = function (e) {
                var progressNum = parseInt(e.loaded / e.total * 100);
                // dirty dom operation for showing progress
                if (targetEl.hasClass('uploading')) {
                    targetEl.find('.cover').css('width', progressNum + '%');
                    targetEl.find('.percent').html(progressNum + '%');
                }
            }
            xhr.send(formData);
            return promise;
        },

        getFileUrl: function (files) {
            var url;
            if (navigator.userAgent.indexOf("MSIE")>=1) { // IE
                url = document.getElementById(sourceId).value;
            } else if(navigator.userAgent.indexOf("Firefox")>0) { // Firefox
                url = window.URL.createObjectURL(document.getElementById(sourceId).files.item(0));
            } else if(navigator.userAgent.indexOf("Chrome")>0) { // Chrome
                url = window.URL.createObjectURL(document.getElementById(sourceId).files.item(0));
            }
            return url;
        },

        previewImg: function (sourceId, targetId) {
            var url = getFileUrl(sourceId);
            var imgPre = document.getElementById(targetId);
            imgPre.src = url;
        },

        getUploadItemTpl: function (data) {
            return this.compileTemplate('#upload-item', data);
        },
        getUploadedItems: function () {
            var uploadItemEls = this.$form.find('.upload-item.file');
            var pdf = this.$form.find('.upload-item.pdf');
            var ppt = this.$form.find('.upload-item.ppt');
            var image = this.$form.find('.upload-item.image');

            return {
                total: uploadItemEls.length,
                pptOrPdf: pdf.length + ppt.length || 0,
                image: image.length || 0
            };
        },
        getFormData: function () {
            var projectName = $('input[name=projectName]').val();
            var financierName = $('input[name=financierName]').val();
            var financierMobile = $('input[name=financierMobile]').val();
            var financRound = $('input[name=financRound]:checked').val();
            var lastInvestAmount = $('input[name=lastInvestAmount]').val();
            var investAmount = $('input[name=investAmount]').val();
            var financierType = $('input[name=financierType]:checked').val();

            // get list of img/pdf/ppt uploaded
            var tmp = [];
            $('input[name=financierBook]').each(function (i, element) {
                tmp.push($(element).val());
            });
            var financierBook = tmp.join(',');

            return {
                projectName: projectName,
                financierName: financierName,
                financierMobile: financierMobile,
                financRound: financRound,
                lastInvestAmount: lastInvestAmount,
                investAmount: investAmount,
                financierType: financierType,
                financierBook: financierBook
            };
        },
        submitForm: function () {
            var data = this.getFormData();

            var phoneRegex = /^1[0-9]{10}$/;
            var numRegex = /^[1-9]{1}[0-9]*$/;
            // validate data before send
            if (!data.projectName) {
                this.showValidateNotice('请填写项目名称');
                return;
            }
            if (!data.financierName) {
                this.showValidateNotice('请填写创始人姓名');
                return;
            }
            if (!data.financierMobile) {
                this.showValidateNotice('请填写创始人电话');
                return;
            }
            if (data.financierMobile && !phoneRegex.test(data.financierMobile)) {
                this.showValidateNotice('请填写正确的创始人电话');
                return;
            }
            // regex test
            if (!data.financRound) {
                this.showValidateNotice('请选择融资轮次');
                return;
            }
            if (data.financRound != 4 && !data.lastInvestAmount) {
                this.showValidateNotice('请填写上轮注资金额');
                return;
            }
            if (data.financRound != 4 && data.lastInvestAmount && !numRegex.test(data.lastInvestAmount)) {
                this.showValidateNotice('请填写正确的上轮注资金额数字');
                return;
            }
            if (!data.investAmount) {
                this.showValidateNotice('请填写期望融资金额');
                return;
            }
            if (data.investAmount && !numRegex.test(data.investAmount)) {
                this.showValidateNotice('请填写正确的期望融资金额数字');
                return;
            }
            // test money
            if (!data.financierType) {
                this.showValidateNotice('请选择您的身份');
                return;
            }
            if (!data.financierBook){
                this.showValidateNotice('请上传商业计划书');
                return;
            }

            // check if uploading
            if(!this.checkIfUploading()) {
                this.showValidateNotice('请等待文件上传完毕再提交');
                return;
            }

            var formData = Object.keys(data).map(function(key) {
                return key + '=' + data[key];
            }).join('&');

            /*
             * 提交申请请求 2017-01-07 jihongzhang@creditease.cn
             * 0000--请求成功
             * 2001--提交次数校验
             * 9999--提交数据校验
             */

            var req = $.ajax({
                method: 'POST',
                url: host + 'finPro/addFinPro.htm?clientType=pc&token=' + getToken(),
                dataType: 'json',
                data: formData
            });

            var self = this;
            req.done(function(data) {
                if (data.code == '0000') {
                    self._showSubmitSuccess();
                } else if (data.code == '4000') {
                    // self.redirect2Login();
                    handleLoginTimeout();
                } else if (data.code == '2001') {
                    self._showSubmitFail(data.desc);
                } else if(data.code == '9999') {
                    self.showValidateNotice(data.desc);
                }
            });
        },

        // check if has file uploading
        checkIfUploading: function () {
            var upLoadingEl = $('.uploading');
            if (upLoadingEl.length > 0) {
                return false;
            } else {
                return true;
            }
        },
        _showSubmitSuccess: function () {
            this._submitSuccessAlert.open();
        },
        _showSubmitFail: function (error) {
            this.$root.find('#submitFailed .content-txt').text(error);
            this._submitFailAlert.open();
        },
        _showApplyError: function (error) {
            this.$root.find('#applyError .content-txt').text(error);
            this._applyErrorAlert.open();
        },
        _showUploadError: function (error, cb) {
            var _uploadErrorAlert = new SmartAlert({
                title: '上传失败',
                content: '<div id="uploadError"><i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">'+error+'</span></div>',
                type: 'confirm',
                okText: '确定',
                onOk: cb,
                onCancel: cb,
                maskClosable: false,
                forceDestroy: true
            });
            _uploadErrorAlert.open();
        },
        createAlertSeries: function () {
            // init result alert tips
            this._submitSuccessAlert = new SmartAlert({
                title: '提交成功',
                content: '<i class="ae-icon ae-icon-success success-icon"></i><div class="content-txt-wrapper"><span class="content-txt">AngelEase平台工作人员将于三个工作日内审核并反馈结果至</span><a class="font-gold" href="/page/myfinancing/myfinancing.html">个人中心-我的项目</a><span>，请您耐心等待。</span></div>',
                type: 'confirm',
                okText: '<a class="apply-font-white" href="/page/myfinancing/myfinancing.html">我知道了</a>',
                onCancel:  function () {
                    window.location.href="/page/myfinancing/myfinancing.html";
                },
                maskClosable: false,
            });

            this._submitFailAlert = new SmartAlert({
                title: '',
                content: '<div id="submitFailed"><i class="ae-icon ae-icon-attention fail-icon"></i><span class="content-txt"></span></div>',
                type: 'confirm',
                okText: '<a class="apply-font-white" href="/page/home/home.html">返回首页</a>',
                maskClosable: false,
            });

            this._applyErrorAlert = new SmartAlert({
                title: '',
                content: '<div id="applyError"><i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt"></span></div>',
                type: 'confirm',
                okText: '<a class="apply-font-white" href="/page/myfinancing/myfinancing.html">查看已提交项目</a>',
                maskClosable: false,
            });
        },
        // $.ajax 上传，不支持进度条和cancel,备用
        $uploadFile: function (blob) {
            var formData = new FormData;
            formData.append('file', blob);

            return $.ajax({
                url: host + 'upload/uploadProFin.htm?clientType=pc&token=' + getToken(),
                type: 'POST',
                data: formData,
                processData: false,
                async: false,
                cache: false,
                contentType: false,
                dataType: false
            });
        },
        // validate file
        // checkFile: function () {
        //     var $fileValueEl = $('.file-value');
        //     var length = $fileValueEl.length;
        //     if(length === 0){
        //         this.showValidateNotice('请上传商业计划书');
        //         return;
        //     }
        //     var fileValueResult = ''
        //     $fileValueEl.each(function (index,element) {
        //         var fileValue = $(element).val();
        //         if(index === length-1) {
        //             fileValueResult += fileValue;
        //         } else {
        //             fileValueResult += fileValue + ',';
        //         }
        //     });
        //     console.log('fileValueResult')
        //     console.log(fileValueResult);
        //     return fileValueResult;
        // },
        // validateMoney: function (money) {
        //     var regMoney= /^[0-9]*[1-9][0-9]*$/;
        //     var result = regMoney.test(money);
        //     if (!result) {
        //         this.showValidateNotice('请输入合法的数据');
        //     } else {
        //         return money;
        //     }
        // },
    }

    ApplyForFunding.init();
})();
