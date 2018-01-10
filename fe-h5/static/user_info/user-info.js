(function () {
    //业务开始
	checkUserLogin();

    function getImageBase64(file) {
        var fr = new FileReader();
        return new Promise(function (resolve) {
          fr.onload = function () {
            resolve(fr.result);
          };
          fr.readAsDataURL(file);
        });
    }
	var UserInfo = {
		init: function () {
			this.setAboutAeHeader();
            this.cacheElements();
            this.bindEvents();
            this.logoOut();
            this.checkIfRealName();
            this.closeAgeCheckDialog();
		},

		setAboutAeHeader: function () {
			$('.cmn-header-title').text('个人信息');
		},
        cacheElements: function() {
            this.uploadInput = $('.user_info_avator input[type=file]');
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
                	var uploadFlag = reduceImg(src,1);
                	if(uploadFlag){
                		$('#headphoto').attr('src',src);
                	}
                });
            }
        },
        logoOut: function () {
            $('#logout-btn').on('click', function () {
                $('#logout-model').show();
                $('#logout-model').find('.gray-mask').show();
                $('.dialog-close').on('click', function () {
                    $('#logout-model').hide();
                })
                $('.logout-yes').on('click', function () {
                    $('#logout-model').hide();
                    $.ajax({
                        url: host + "user/logout.htm",
                        contentType: "application/x-www-form-urlencoded;charset=utf-8",
                        dataType: "json",
                        type: "post",
                        data: "clientType=wap&token=" + getToken(),
                        success: function (data) {
                            if (data.code == '0000') {
                                clearToken();
                                window.location.href = "/page/login/login.html";
                            } else {
                                showError(data.desc)
                            }
                        }
                    });
                })
            })
        },

        closeAgeCheckDialog: function () {
            $('#age-close,#age-iknow').click(function () {
                $('#age-model').hide();
            });
        },

        // 检验用户状态
        checkIfRealName: function() {
            $.ajax({
                type: 'POST',
                url: host + 'baseuser/getUserStatus.htm',
                data:token_client_data,
                dataType: 'JSON',
                success: function (data) {
                    if (data.code === '0000') {
                        // 投资人认证
                        if (data.data.investorStatus == 0) {
                            // 红色 认证页  
                            if (data.data.idcardType === 1) {
                                $('#investor').click(function () {
                                    $.ajax({
                                        url: host + 'user/getUserInfo.htm',
                                        dataType: 'JSON',
                                        type: 'POST',
                                        data:token_client_data,
                                        success: function (result) {
                                            // 身份证用户年龄验证不通过，阻止进入合格投资人认证
                                            if (result.data.certificateFlag === 1) {
                                                $('#age-model').find('.suc-text').text(result.data.denyMsg);
                                                $('#age-model').show();
                                            } else {
                                                window.location.href="/page/investor_cert_part1/investor-cert-form.html";
                                            }
                                        }
                                    });
                                });

                            // 非身份证用户不做年龄验证
                            } else {
                                $('#investor').attr('onclick','window.location.href="/page/investor_cert_part1/investor-cert-form.html"');  
                            }                       
                        } else if (data.data.investorStatus == 1 || data.data.investorStatus == 5) {
                            // 红色 结果页
                            $('#investor').attr('onclick','window.location.href="/page/investor_cert_part2/investor-cert-partial-suc.html"');
                        } else if (data.data.investorStatus == 2 || data.data.investorStatus == 3 || data.data.investorStatus == 4) {
                            // 绿色 结果页
                            $('#investor_icon_id').attr('class','user_suc_icon');
                            $('#investor_icon_id i').attr('class','ae-mobile ae-mobile-success icon-item');
                            $('#investor').attr('onclick','window.location.href="/page/investor_cert_part2/investor-cert-partial-suc.html"');
                        }

                        // 实名认证
                        if (data.data.userCheckStatus == 0) {
                            // 未实名
                            $('#certification').attr('onclick', 'window.location.href="/page/real_name_auth/real_name_auth.html"');
                        } else if (data.data.userCheckStatus == 1 || data.data.userCheckStatus == 3) {
                            // 失败和审核中
                            $('#certification').attr('onclick', 'window.location.href="/page/real_name_auth/real_name_suc.html"');
                        } else if (data.data.userCheckStatus == 2) {
                            // 成功
                            $('#realname_icon_id').attr('class','user_suc_icon');
                            $('#realname_icon_id i').attr('class','ae-mobile ae-mobile-success icon-item');
                            $('#certification').attr('onclick', 'window.location.href="/page/real_name_auth/real_name_suc.html"');

                            // 只对大陆具有身份证用户进行年龄验证
                            // if (data.data.idcardType === 1) {
                            //     $('#certification').click(function () {
                            //         $.ajax({
                            //             url: host + 'user/getUserInfo.htm',
                            //             dataType: 'JSON',
                            //             type: 'POST',
                            //             data:token_client_data,
                            //             success: function (result) {
                            //                 // 身份证用户年龄验证不通过，阻止进入合格投资人认证
                            //                 if (result.data.certificateFlag === 1) {
                            //                     $('#age-model').find('.suc-text').text(result.data.denyMsg);
                            //                     $('#age-model').show();
                            //                 } 
                            //             }
                            //         });
                            //     });
                            // } else {
                            //     // 红色 认证页  
                            //     $('#certification').attr('onclick', 'window.location.href="/page/real_name_auth/real_name_suc.html"');
                            // }
                        }

                        if (data.data.userCheckStatus == 3) {
                            // 失败和审核中
                            $('#investor').attr('onclick', 'window.location.href="/page/real_name_auth/real_name_suc.html"');
                        }
                    }
                    
                }
            });
        }
	};

	UserInfo.init();

    getUserinfo();
    genderSelectSave();

})();

function getUserinfo(){
    $.ajax({
        url: host + "user/getUserInfo.htm",
        contentType: "application/x-www-form-urlencoded;charset=utf-8",
        dataType: "json",
        type: "post",
        data: token_client_data,
        success: function (data) {
            if (data.code == '0000') {
                if (data.data.headphoto != ''&& data.data.headphoto!=null){
                    $("#headphoto").attr("src", staticUrl + data.data.headphoto);
                }
//                $("#mobile").html(data.data.mobile.substring(0, 3) + "****" + data.data.mobile.substring(7));
                $("#nickname").html(data.data.nickname);
                $("#email").html(data.data.email);
                $("#qq").html(data.data.qq);
                $("#weixin").html(data.data.weixin);
                if (data.data.sex == 1){
                    $('#myid').val(1)
                } else if (data.data.sex == 2){
                    $('#myid').val(2)
                }else {
                    $('#myid').val(0);
                }
            } else {
                showError(data.desc)
            }
		}
    });
}

function showHeadPhoto(){
    //以下即为完整客户端路径
    var file_img=document.getElementById("headphoto");
    var iptfileupload = document.getElementById('uploadHeadphoto');
    getPath(file_img,iptfileupload,file_img);
    setTimeout('uploadHeadphoto()',1000);
}

function uploadHeadphoto(){
	var imgSrc = $('#headphoto').attr('src');
	showError('更换头像成功');
	$.ajax({
	    url: host + "user/updateUserInfo.htm",
	    contentType: "application/x-www-form-urlencoded;charset=utf-8",
	    dataType: "json",
	    type: "post",
	    data: "img="+imgSrc+"&clientType=wap&token=" + getToken()+"&date="+new Date(),
	    success: function (data) {
//	    	alert('更换头像成功');
	    }
	});
}

function genderChange () {
    if($('#myid').val() == 0){
        $('#myid').val(0);
    }else if($('#myid').val() == 1){
        $('#myid').val(1);
    }else if ($('#myid').val() == 2) {
        $('#myid').val(2);
    }
}

function genderSelectSave () {
    $('#myid').on('change', function () {
        var value = $('#myid').val();
        var datas = "sex="+value;
        $.ajax({
            url: host + "user/updateUserInfo.htm",
            contentType: "application/x-www-form-urlencoded;charset=utf-8",
            dataType: "json",
            type: "post",
            data: datas+"&clientType=wap&token=" + getToken(),
            success: function (data) {
                if (data.code == '0000') {
                    // history.back(-1);
                }else{
    //              alert('操作失败')
                    showError('操作失败');
                }
            }
        });
    })
}

function logout(){
	if(confirm('确定退出吗？')){
		$.ajax({
	        url: host + "user/logout.htm",
	        contentType: "application/x-www-form-urlencoded;charset=utf-8",
	        dataType: "json",
	        type: "post",
	        data: "clientType=wap&token=" + getToken(),
	        success: function (data) {
	            if (data.code == '0000') {
	                clearToken();
	                window.location.href = "/page/login/login.html";
	            } else {
	                showError(data.desc)
	            }
	        }
	    });
	}
}
//弹框隐藏
function codefans(){
	var box=document.getElementById("toastBox");
	box.style.display="none";
}
//显示错误信息
function showError(errorDesc){
	/*$(".modify-suc-text").html(errorDesc);
	$("#toastBox").show();
	setTimeout("codefans()",1000);*/
	new SmartToast({
		content:errorDesc,
		type:'warn',
		duration:3
	});
}