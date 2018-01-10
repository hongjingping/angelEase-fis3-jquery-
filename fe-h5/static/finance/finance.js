(function () {
    checkUserLogin();

    // check finance times
    $.ajax({
        url: host + 'finPro/checkFinProject.htm',
        dataType: 'json',
        data: token_client_data,
        type: 'post',
        success: function (data) {
            if (data.code === '2001') {
                window.location.href = baseUrl + 'myfinancing/myfinancing.html?tab=1';
            } 
        }
    });

    // redirect to business plan page
    $('.plan').click(function () {
        window.location.href = '/page/finance/example.html';
    });

    // switch radio style
    $('.radio-cols').find('.radio-col').on('click', function () {
        $(this).siblings('.radio-col').removeClass('i-radio-checked').addClass('i-radio-unchecked');
        $(this).addClass('i-radio-checked');
    });

    // select option change
    $('#financeRound').on('change', function () {
        // '4' represent others
        if ($(this).val() != 4) {
            $('#lastInvest').show();	
        } else {
            $('#lastInvestAmount').val('hello world');
            $('#lastInvest').hide();
        }
    });

    // success msg
    $('.dialog-close').click(function () {
        $('#suc-model').hide();  
    });

    // to personal center
    $('.confirm-wrapper').click(function () {
        window.location.href = '/page/myfinancing/myfinancing.html?tab=0';
    });

    var tmpl = '<li class="uploader-file" style="background-image:url(#url#)" data-img="#addr#"></li>',
            $gallery = $('#gallery'), $galleryImg = $('#galleryImg'),
            $uploaderInput = $('#uploaderInput'),
            $uploaderFiles = $('#uploaderFiles'),
            MAX_UPLOAD_FILE_SIZE = 2 * 1024 * 1024,
            MAX_UPLOAD_NUM = 6;

    // file upload and preview img
    $uploaderInput.on('change', function(e) {
        var formData = new FormData($('.myform-cols')[0]);
        $('.loading-img').show();

        if (!this.value) {
            $('.loading-img').hide();
        } 

        if (this.files[0].size > MAX_UPLOAD_FILE_SIZE) {
            new SmartToast({
                content: '请提交小于2M的jpg&png文件',
                type: 'warn',
            });
            $('.loading-img').hide();
            return;
        }

        $.ajax({
            url: host + 'upload/uploadProFin.htm?clientType=wap&token=' + getToken() + '&d=' + new Date().getTime(),
            type: 'POST',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function (result) {}
        }).done(function (result) {
            var updateData = JSON.parse(result);

            if (updateData.code === '4000') {
                window.location.href = loginUrl;
            } else if (updateData.code === '9999') {
                $('.loading-img').hide();
                new SmartToast({
                    content: updateData.desc,
                    type: 'warn',
                });
                return;
            }

            var src, url = window.URL || window.webkitURL || window.mozURL, files = e.target.files;
            for (var i = 0, len = files.length; i < len; ++i) {
                var file = files[i];

                if (url) {
                    src = url.createObjectURL(file);
                } else {
                    src = e.target.result;
                }

                $('.loading-img').hide();
                $uploaderFiles.append($(tmpl.replace('#url#', src).replace('#addr#', updateData.data)));
            }

            if ($uploaderFiles.find('li').size() > MAX_UPLOAD_NUM - 1) {
                $('.single-file').hide();
            }
        });
    });

    $uploaderFiles.on('click', 'li', function(){
        var $currentImg = $(this);

        $galleryImg.attr('style', this.getAttribute('style'));
        $gallery.fadeIn(100);

        $('#galleryDel').click(function () {
            if ($uploaderFiles.find('li').size() < MAX_UPLOAD_NUM + 1) {
                $('.single-file').show();
            }

            $currentImg.remove();
        });
    });

    $gallery.on('click', function(){
        $gallery.fadeOut(100);
    });

    // commit finance info
    $('.final-commit').click(function () {
        // validate info
        var $personIdentity = $('.i-radio-checked').attr('data-fund');
        var $projectName = $('#projectName').val();
        var $projectFounder = $('#projectFounder').val();
        var $founderPhone = $('#founderPhone').val();
        var $financeRound = $('#financeRound').val();
        var $financeAmount = $('#financeAmount').val();
        var $lastInvestAmount = $('#lastInvestAmount').val();
        
        if (!validator.isDecimal($personIdentity)) {
            new SmartToast({
                content: '请选您的身份',
                type: 'warn',
            });
            return;
        }

        if (!validator.isLength($projectName, {min:1, max: 64})) {
            new SmartToast({
                content: '请录入项目名称',
                type: 'warn',
            });
            return;
        }

        if (!validator.isByteLength($projectFounder, {min:2, max: 16})) {
            new SmartToast({
                content: '请录入创始人姓名',
                type: 'warn',
            });
            return;
        }

        if (!validator.isMobilePhone($founderPhone, 'zh-CN')) {
            new SmartToast({
                content: '请录入正确的创始人电话',
                type: 'warn',
            });
            return;
        }

        if (!validator.isDecimal($financeRound)) {
            new SmartToast({
                content: '请选择融资轮次',
                type: 'warn',
            });
            return;
        }

        if ($('#lastInvest').is(':hidden')) {
            $lastInvestAmount = 0;
        } else {
            if (!validator.isDecimal($lastInvestAmount)) {
                new SmartToast({
                    content: '请填写上轮注资金额',
                    type: 'warn',
                });
                return;
            }
        }

        if (!validator.isDecimal($financeAmount)) {
            new SmartToast({
                content: '请您填写期望融资金额',
                type: 'warn',
            });
            return;
        }

        // concat uploader file path
        var $uploaderPathStrs = '';
        $('.uploader-file').each(function () {
            if ($(this).attr('data-img')) {
                $uploaderPathStrs += $(this).attr('data-img') + ',';
            }
        });

        if (!validator.isLength($uploaderPathStrs, {min:1, max: undefined})) {
            new SmartToast({
                content: '请提交小于2M的jpg&png文件',
                type: 'warn',
            });
            return;
        }

        var commitData = {
            token: token_client_data.token,
            clientType: token_client_data.clientType,
            financierType: $personIdentity,
            projectName: $projectName,
            financierName: $projectFounder,
            financierMobile: $founderPhone,
            financRound: $financeRound,
            investAmount: $financeAmount,
            lastInvestAmount: $lastInvestAmount,
            financierBook: $uploaderPathStrs
        };

        // update info
        $.ajax({
            type: 'post',
            url: host + 'finPro/addFinPro.htm',
            dataType: 'JSON',
            data: commitData,
            success: function (result) {
                if (result.code === '0000') {
                    $('#suc-model').show();  
                } else if (result.code === '4000') {
                    window.location.href = loginUrl;
                } else if (result.code === '2001') {
                    $('#suc-model').find('.suc-text').text(result.desc);
                    $('#suc-model').find('.dialog-close').hide();
                    $('#suc-model').show();
                } else {
                    new SmartToast({
                        content: result.desc,
                        type: 'warn',
                    });
                }
            }
        });
    });

})();