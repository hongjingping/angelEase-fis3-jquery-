$(document).ready(function() {

    checkUserLogin();

    var editProfile = {
        init: function() {
            this.cacheElements();
            this.bindEvents();
        },
        cacheElements: function() {
            this.operateForEdit = $('.value-output .operate.edit');
            this.operateForSave = $('.edit-input .operate.save');
            this.operateForCancel = $('.edit-input .operate.cancel');
            this.uploadInput = $('.avatar-wrapper input[type=file]');
            this.avatarUploader = $('.avatar-uploader');
        },
        bindEvents: function() {
            this.operateForEdit.on('click', this.showEditForm.bind(this));
            this.operateForSave.on('click', this.saveProfile.bind(this));
            this.operateForCancel.on('click', this.quitEditForm.bind(this));
            this.uploadInput.on('change', this.uploadAvatar.bind(this));
        },
        showEditForm: function(e) {
            var valueOutput = $(e.target).parent('.value-output');
            var editInput = valueOutput.siblings('.edit-input');
            var text = valueOutput.find('.value').text();
             if (editInput.find('input').length)
                editInput.find('input').val(text);
            if (editInput.find('select').length)
                editInput.find('select').val(text);
            valueOutput.hide();
            editInput.show();
        },
        saveProfile: function(e) {
            $(".error-notice").css("visibility", "hidden");
            $("#error1").html('');
            var editInput = $(e.target).parent('.edit-input');
            editInput.hide();
            var valueOutput = editInput.siblings('.value-output');
            var inputValue;
            if (editInput.find('input').length){
                inputValue = editInput.find('input').val();
                
                if (editInput.find('input')[0].name=='nickname' && inputValue == '') {
                	$(".error-notice").css("visibility", "visible");
                	$("#error1").html("昵称不能为空，请重填");
                    editInput.hide();
                    valueOutput.show();
                    return false;
                }else{
                    $(".error-notice").css("visibility", "hidden");
                }
                
                if (editInput.find('input')[0].name=='email'&&inputValue != '' && !(/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(inputValue))) {
                	$(".error-notice").css("visibility", "visible");
                	$("#error1").html("邮箱地址有误，请重填");
                    editInput.hide();
                    valueOutput.show();
                    return false;
                }else{
                    $(".error-notice").css("visibility", "hidden");
                }
                if (editInput.find('input')[0].name=='qq'&&inputValue != '' && !(/^[0-9]*$/.test(inputValue))) {
                    $(".error-notice").css("visibility", "visible");
                    $("#error1").html("QQ格式有误，请重填");
                    editInput.hide();
                    valueOutput.show();
                    return false;
                }else{
                    $(".error-notice").css("visibility", "hidden");
                }
                var name = editInput.find('input').attr('name');
                updateUserinfo(name+'='+inputValue);
                valueOutput.find('.value').text(inputValue);
            }
            if (editInput.find('select').length){
                inputValue = editInput.find('select').val();
                if(inputValue == null || inputValue == ''){
                    $(".error-notice").css("visibility", "visible");
                    $("#error1").html("性别不能为空，请重填");
                    editInput.hide();
                    valueOutput.show();
                    return false;
                }
                if(inputValue=='0'){
                    valueOutput.find('.value').text('保密');
                }else if(inputValue=='1'){
                    valueOutput.find('.value').text('男');
                }else if(inputValue=='2'){
                    valueOutput.find('.value').text('女');
                }
            }
            
            valueOutput.show();
        },
        quitEditForm: function(e) {
            var editInput = $(e.target).parent('.edit-input');
            editInput.hide();
            var valueOutput = editInput.siblings('.value-output');
            valueOutput.show();
        },
        uploadAvatar: function(e) {
            var file = e.target.files[0];
            if(!/image\/\w+/.test(file.type)){
                var readSmartAlert = new SmartAlert({
                    title: '报错',
                    content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">请确保文件为图像类型</span>',
                    type: 'confirm',
                    okText: '我知道了',
                    maskClosable: false,
                });
                readSmartAlert.open();
                return false;
            }
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function(e){
                var uploadFlag = reduceImg(this.result,1);
                if(uploadFlag) {
                    $('#headphoto').attr('src',this.result);
                    $('.bar-head-img').attr('src',this.result);
                }
            }
        }
    }
    editProfile.init();

    // 光标放在头像上显示Icon，光标离开Icon消失
    $('.avatar-wrapper').hover(function(){
        $('.upload-file-icon').css('display','block');
    },function(){
        $('.upload-file-icon').css('display','none');
    });
})
